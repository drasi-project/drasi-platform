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
import io.debezium.connector.oracle.OracleConnection;
import io.debezium.connector.oracle.OracleConnectorConfig;
import io.debezium.jdbc.JdbcConnection;
import io.drasi.DatabaseStrategy;
import io.drasi.models.NodeMapping;
import io.drasi.models.RelationalGraphMapping;
import io.drasi.source.sdk.Reactivator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;

public class Oracle implements DatabaseStrategy {
    private static final Logger log = LoggerFactory.getLogger(Oracle.class);

    @Override
    public JdbcConnection getConnection(Configuration config) {
        var oracleConfig = new OracleConnectorConfig(config);
        return new OracleConnection(oracleConfig.getJdbcConfig(), null);
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
    public long extractLsn(JsonNode sourceChange) {
        var scn = sourceChange.path("scn").asText();
        if (scn == null || scn.isEmpty()) {
            return 0;
        }
        
        try {
            return Long.parseLong(scn);
        } catch (NumberFormatException e) {
            log.warn("Failed to parse SCN: {}", scn);
            return 0;
        }
    }

    @Override
    public String extractTableName(JsonNode sourceChange) {
        var schema = sourceChange.path("schema").asText();
        var table = sourceChange.path("table").asText();
        return schema + "." + table;
    }

    @Override
    public Configuration createConnectorConfig(Configuration baseConfig) {
        return Configuration.create()
                .with(baseConfig)
                .with("connector.class", "io.debezium.connector.oracle.OracleConnector")
                .with("log.mining.strategy", "online_catalog")
                .with("snapshot.mode", "no_data")
                .with("database.connection.adapter", "logminer")
                .with("log.mining.batch.size.default", "1000")
            .build();
    }

    @Override
    public NodeMapping getNodeMapping(Connection conn, String schema, String tableName) throws SQLException {
        try (var rs = conn.getMetaData().getPrimaryKeys(null, schema.toUpperCase(), tableName.toUpperCase())) {
            if (!rs.next()) {
                throw new SQLException("No primary key found for " + schema + "." + tableName);
            }
            
            var mapping = new NodeMapping();
            mapping.tableName = schema + "." + tableName;
            mapping.keyField = rs.getString("COLUMN_NAME");
            mapping.labels = Collections.singleton(tableName);
            
            return mapping;
        }
    }

    @Override
    public void initialize(Configuration config, RelationalGraphMapping relationalGraphMapping) {
        try (var jdbcConn = getConnection(config);
             var conn = jdbcConn.connection()) {
            enableSupplementalLogging(conn);
            
            for (var mapping : relationalGraphMapping.nodes) {
                enableTableSupplementalLogging(conn, mapping.tableName);
            }
            
        } catch (SQLException e) {
            log.error("Error initializing Oracle supplemental logging: {}", e.getMessage());
            Reactivator.TerminalError(e);
        }
    }

    private void enableSupplementalLogging(Connection conn) throws SQLException {
        try (var stmt = conn.prepareStatement("ALTER DATABASE ADD SUPPLEMENTAL LOG DATA")) {
            stmt.execute();
            log.info("Enabled minimal supplemental logging for database");
        } catch (SQLException e) {
            log.warn("Could not enable supplemental logging: {}", e.getMessage());
        }
    }

    /**
     * Validates that the table name matches an expected Oracle identifier pattern.
     * This allows simple unquoted identifiers in optional SCHEMA.TABLE form.
     */
    private boolean isValidTableName(String tableName) {
        if (tableName == null || tableName.isEmpty()) {
            return false;
        }
        // Allow alphanumeric and underscore segments, with optional single dot separator (SCHEMA.TABLE)
        return tableName.matches("^[A-Za-z0-9_]+(\\.[A-Za-z0-9_]+)?$");
    }

    private void enableTableSupplementalLogging(Connection conn, String tableName) throws SQLException {
        if (!isValidTableName(tableName)) {
            log.warn("Skipping enabling supplemental logging for invalid table name: {}", tableName);
            return;
        }

        String sql = "ALTER TABLE " + tableName + " ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS";
        try (var stmt = conn.prepareStatement(sql)) {
            stmt.execute();
            log.info("Enabled supplemental logging for table {}", tableName);
        } catch (SQLException e) {
            log.warn("Could not enable supplemental logging for table {}: {}", tableName, e.getMessage());
        }
    }
}