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
import io.debezium.connector.sqlserver.SqlServerConnection;
import io.debezium.connector.sqlserver.SqlServerConnectorConfig;
import io.debezium.jdbc.JdbcConnection;
import io.drasi.DatabaseStrategy;
import io.drasi.models.NodeMapping;
import io.drasi.source.sdk.Reactivator;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implements the strategy to connect to a SQL Server database.
 */
public class SqlServer implements DatabaseStrategy {
    private static final Logger log = LoggerFactory.getLogger(SqlServer.class);

    @Override
    public JdbcConnection getConnection(Configuration config) {
        var sqlConfig = new SqlServerConnectorConfig(config);
        return new SqlServerConnection(sqlConfig, null, new HashSet<>(), true);
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
    public String getTablesListConfigName() {
        return "table.include.list";
    }

    @Override
    public String getDatabaseNameConfigName() {
        return "database.names";
    }

    @Override 
    public long extractLsn(JsonNode sourceChange) {
        var lsn = sourceChange.get("change_lsn").asText();
        if (lsn == null || lsn.isEmpty()) {
            return 0;
        }
        
        String[] parts = lsn.split(":");
        if (parts.length != 3) {
            return 0;
        }
        
        // VLF = Virtual Log File. Transaction log is divided into multiple VLFs.
        // Each VLF is contiguous section of log file.
        long vlfSeqNo = Long.parseLong(parts[0], 16);

        // Log block offset is the offset of the log block within the VLF.
        // Typically log blocks are 512 bytes or multiples of 512 bytes.
        long logBlockOffset = Long.parseLong(parts[1], 16);

        // Pinpoints the exact record within the log block.
        // A typical record size can be assumed to be around 64 bytes.
        // Then for a 512 byte block, there can be 8 records (0 to 7).
        long slotNo = Long.parseLong(parts[2], 16);
        
        // We are allocating 32 bytes for VLF sequence number,
        // 16 bytes for log block offset and 16 bytes for slot number.
        return (vlfSeqNo << 32) | (logBlockOffset << 16) | slotNo;
    }

    @Override
    public String extractTableName(JsonNode sourceChange) {
        return sourceChange.path("schema").asText() + "." + sourceChange.path("table").asText();
    }

    @Override
    public Configuration createConnectorConfig(Configuration baseConfig) {

        var encryptConfigValue = Reactivator.GetConfigValue("encrypt");
        if (encryptConfigValue == null || encryptConfigValue.isEmpty()) {
            Reactivator.TerminalError(new IllegalArgumentException("Encrypt setting is required."));
        }

        var trustServerCertConfigValue = Reactivator.GetConfigValue("trustServerCertificate", "false");
        var authenticationConfigValue = Reactivator.GetConfigValue("authentication", "NotSpecified");

        return Configuration.create()
                // Start with the base configuration.
                .with(baseConfig)
                // Specify the SQL Server connector class.
                .with("connector.class", "io.debezium.connector.sqlserver.SqlServerConnector")
                // Whether JDBC connections to SQL Server should be encrypted. By default this is true.
                .with("database.encrypt", encryptConfigValue)
                // Capture structure of relevant tables, but do not capture data.
                .with("snapshot.mode", "no_data")
                // Whether to trust the server certificate. By default this is false.
                .with("driver.trustServerCertificate", trustServerCertConfigValue)
                // Authentication method to use. By default this is NotSpecified.
                .with("driver.authentication", authenticationConfigValue)
            .build();
    }
}