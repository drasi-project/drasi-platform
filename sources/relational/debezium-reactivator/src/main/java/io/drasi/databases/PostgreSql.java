/*
* Copyright 2024 The Drasi Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package io.drasi.databases;

import com.fasterxml.jackson.databind.JsonNode;
import io.debezium.config.Configuration;
import io.debezium.connector.postgresql.PostgresConnectorConfig;
import io.debezium.connector.postgresql.connection.PostgresConnection;
import io.debezium.jdbc.JdbcConnection;
import io.drasi.DatabaseStrategy;
import io.drasi.models.NodeMapping;
import io.drasi.models.RelationalGraphMapping;
import io.drasi.source.sdk.Reactivator;
import io.drasi.source.sdk.SourceProxy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class PostgreSql implements DatabaseStrategy {
    private static final Logger log = LoggerFactory.getLogger(PostgreSql.class);

    @Override
    public JdbcConnection getConnection(Configuration config) {
        var pgConfig = new PostgresConnectorConfig(config);
        var jdbcConfig = pgConfig.getJdbcConfig();
        
        var connection = new PostgresConnection(jdbcConfig, "drasi");
        return connection;
    }

    @Override
    public NodeMapping getNodeMapping(Connection conn, String schema, String tableName) throws SQLException {
        try (var rs = conn.getMetaData().getPrimaryKeys(null, schema, tableName)) {
            if (!rs.next()) {
                throw new SQLException("No primary key found for " + tableName);
            }
            
            var mapping = new NodeMapping();
            mapping.tableName = rs.getString("TABLE_SCHEM") + "." + tableName;
            mapping.keyField = rs.getString("COLUMN_NAME");
            mapping.labels = Collections.singleton(tableName);
            
            return mapping;
        }
    }

    @Override
    public long extractLsn(JsonNode sourceChange) {
        return sourceChange.get("lsn").asLong();
    }

    @Override
    public String extractTableName(JsonNode sourceChange) {
        var schema = sourceChange.path("schema").asText();
        var table = sourceChange.path("table").asText();
        return schema + "." + table;
    }

    @Override
    public String getDatabaseNameConfigName() {
        return "database.dbname";
    }

    @Override
    public String getTablesListConfigName() {
        return "table.include.list";
    }

    @Override
    public Configuration createConnectorConfig(Configuration baseConfig) {
        var publicationSlotName = "rg_" + baseConfig.getString("name");
        var result = Configuration.create()
                // Start with the base configuration.
                .with(baseConfig)
                // Specify the Postgres connector class.
                .with("connector.class", "io.debezium.connector.postgresql.PostgresConnector")
                // Default is decoder-bufs.
                .with("plugin.name", "pgoutput")
                // Default is all_tables.
                .with("publication.autocreate.mode", "filtered")
                // Name of publication created when using pgoutput plugin. Deault is dbz_publication.
                .with("publication.name", publicationSlotName)
                // Name of replication slot for streaming changes from the database. Default is debezium. 
                .with("slot.name", publicationSlotName)
                // If started first time, start from beginning, else start from last stored LSN.
                .with("snapshot.mode", "no_data");

        String identityType = SourceProxy.GetConfigValue("IDENTITY_TYPE");
        if ("MicrosoftEntraWorkloadID".equals(identityType)) {

            var tokenFetcher = new AzureIdentityTokenFetcher();
            var accessToken = tokenFetcher.getToken();

            result = result
                .with("database.password", accessToken)
                .with("database.sslmode", "require");

            log.info("Using Azure Identity PostgreSQL Driver for authentication");
        }

        return result.build();
    }

    @Override
    public void initialize(Configuration config, RelationalGraphMapping relationalGraphMapping) {
        // For PostgreSql DBs, Debezium Engine creates a publication on startup
        // for tables in the include list, as we've set the publication.autocreate.mode
        // to `filtered`. However, if we restart the Debezium engine with changes to
        // the `table.include.list`, it doesn't seem to update the publication. So,
        // we need to check if the publication tables match the config and update them.
        try (var conn = getConnection(config).connection()) {
            var pubName = config.getString("publication.name");
            var tableList = config.getString(getTablesListConfigName()).split(",");
            
            // Debezium Engine executes `CREATE PUBLICATION {publication.name}`
            //  on startup for tables in the include list, as we've set the
            //  publication.autocreate.mode to `filtered`.
            if (!publicationExists(conn, pubName)) {
                log.warn("Publication {} does not exist, skipping initialization", pubName);
                return;
            }

            var currentTables = getPublicationTables(conn, pubName);
            var expectedTables = Set.of(tableList);

            if (!currentTables.containsAll(expectedTables) || !expectedTables.containsAll(currentTables)) {
                log.warn("Publication {} tables do not match config", pubName);
                setPublicationTables(conn, pubName, relationalGraphMapping.nodes);
            }
        } catch (SQLException e) {
            log.error("Error initializing publication: {}", e.getMessage());
            Reactivator.TerminalError(e);
        }
    }

    private boolean publicationExists(Connection conn, String pubName) throws SQLException {
        try (var stmt = conn.prepareStatement("select * from pg_publication where pubname = ?")) {
            stmt.setString(1, pubName);
            try (var rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    private Set<String> getPublicationTables(Connection conn, String pubName) throws SQLException {
        var result = new HashSet<String>();
        try (var stmt = conn.prepareStatement("select * from pg_publication_tables where pubname = ?")) {
            stmt.setString(1, pubName);
            try (var rs = stmt.executeQuery()) {
                while (rs.next()) {
                    result.add(rs.getString("schemaname") + "." + rs.getString("tablename"));
                }
            }
        }
        return result;
    }

    // Alter the publication to include all the tables in the include list.
    private void setPublicationTables(Connection conn, String publicationName, List<NodeMapping> mappings) throws SQLException {
        var tableList = "";
        for (var mapping : mappings) {
            if (tableList == "")
                tableList += formatTableName(mapping.tableName);
            else
                tableList += ", " + formatTableName(mapping.tableName);
        }

        try (var stmt = conn.prepareStatement("ALTER PUBLICATION \"" + publicationName + "\" SET TABLE " + tableList)) {
            stmt.execute();
            log.info("Updated publication " + publicationName);
        }
    }

    // Quote the table name without quoting the schema name.
    private String formatTableName(String name) {
        if (!name.contains("."))
            return "\"" + name + "\"";
        var comps = name.split("\\.");
        return comps[0] + "." + "\"" + comps[1] + "\"";
    }
}