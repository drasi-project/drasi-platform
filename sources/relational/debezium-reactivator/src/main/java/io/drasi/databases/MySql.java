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
import io.debezium.connector.mysql.MySqlConnectorConfig;
import io.debezium.connector.mysql.jdbc.MySqlConnection;
import io.debezium.connector.mysql.jdbc.MySqlConnectionConfiguration;
import io.debezium.connector.mysql.jdbc.MySqlFieldReaderResolver;
import io.debezium.jdbc.JdbcConnection;
import io.drasi.DatabaseStrategy;
import io.drasi.models.NodeMapping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;

public class MySql implements DatabaseStrategy {
    private static final Logger log = LoggerFactory.getLogger(MySql.class);

    @Override
    public JdbcConnection getConnection(Configuration config) {
        var connectionConfig = new MySqlConnectionConfiguration(config);
        var connectorConfig = new MySqlConnectorConfig(config);
        return new MySqlConnection(connectionConfig, MySqlFieldReaderResolver.resolve(connectorConfig));
    }

    @Override
    public String getDatabaseNameConfigName() {
        return "database.include.list";
    }

    @Override
    public String getTablesListConfigName() {
        return "table.include.list";
    }

    @Override
    public long extractLsn(JsonNode sourceChange) {
        // Get binlog position which is always present
        long position = sourceChange.path("pos").asLong(0);
        
        // Get binlog file number from filename (ex: "mysql-bin.000003")
        String binlogFile = sourceChange.path("file").asText("");
        long fileNumber = 0;
        if (!binlogFile.isEmpty()) {
            try {
                // Extract number from end of filename
                String numberPart = binlogFile.substring(binlogFile.lastIndexOf(".") + 1);
                fileNumber = Long.parseLong(numberPart);
            } catch (NumberFormatException e) {
                // If parsing fails, use 0
            }
        }
        
        // Combine file number and position into single LSN.
        // Binlog file numbers have a specific format:
        // they're 6-digit numbers padded with zeroes (e.g., "mysql-bin.000001").
        // Thus, atmost they will need 20 bits. They are always increasing, and
        // to maintain replication order, we can give them the higher 20 bits.
        long lsn = (fileNumber << 44) | position;
        return lsn;
    }

    @Override
    public String extractTableName(JsonNode sourceChange) {
        return sourceChange.path("db").asText() + "." + sourceChange.path("table").asText();
    }

    @Override
    public Configuration createConnectorConfig(Configuration baseConfig) {
        return Configuration.create()
                // Start with the base configuration.
                .with(baseConfig)
                // Specify the MySQL connector class.
                .with("connector.class", "io.debezium.connector.mysql.MySqlConnector")
                // Numeric ID of this database client. No default.
                .with("database.server.id", "1")
                // Immediately bgin to stream changes without performing a snapshot.
                // Note: Might be deprecated in future. no_data needs extra permissions for locking.
                // For no_data to work, debezium engine needs (at least one of) the RELOAD or FLUSH_TABLES privilege(s).
                // RELOAD allows flushing logs, caches, privileges, and tables.
                //      If misused, flushing logs could disrupt replication and CDC.
                // FLUSH_TABLES allows locking tables and refreshing metadata.
                //      If misused, it can block writes to tables, impacting performance.
                .with("snapshot.mode", "never")
            .build();
    }

    @Override
    public NodeMapping getNodeMapping(Connection conn, String schema, String tableName) throws SQLException {
        // MySQL uses catalog instead of schema
        try (var rs = conn.getMetaData().getPrimaryKeys(schema, null, tableName)) {
            if (!rs.next()) {
                throw new SQLException("No primary key found for " + tableName);
            }
            
            var mapping = new NodeMapping();
            mapping.tableName = rs.getString("TABLE_CAT") + "." + tableName;
            mapping.keyField = rs.getString("COLUMN_NAME");
            mapping.labels = Collections.singleton(tableName);
            
            return mapping;
        }
    }
}