package com.reactivegraph;

import com.reactivegraph.models.NodeMapping;
import io.debezium.config.Configuration;
import io.debezium.connector.postgresql.PostgresConnectorConfig;
import io.debezium.connector.postgresql.connection.PostgresConnection;
import io.debezium.jdbc.JdbcConfiguration;
import io.debezium.jdbc.JdbcConnection;

import java.sql.SQLException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class SchemaReader {

    private JdbcConfiguration configuration;

    public SchemaReader(Configuration config) {
        configuration = new PostgresConnectorConfig(config).getJdbcConfig();  // TODO make generic
    }

    private JdbcConnection GetConnection() {
        return new PostgresConnection(configuration, "drasi"); // TODO make generic
    }

    public List<NodeMapping> ReadMappingsFromSchema(String[] tableNames) throws SQLException {
        var result = new LinkedList<NodeMapping>();
        try (var conn = GetConnection().connection()) {
            var metadata = conn.getMetaData();
            for (var table : tableNames) {
                table = table.trim();
                String schemaName = null;
                String tableName = table;
                if (table.contains(".")) {
                    var tableComps = table.split("\\.");
                    schemaName = tableComps[0];
                    tableName = tableComps[1];
                }

                var rs = metadata.getPrimaryKeys(null, schemaName, tableName);
                if (!rs.next())
                    throw new SQLException("No primary key found for " + table);
                var mapping = new NodeMapping();
                mapping.tableName = rs.getString("TABLE_SCHEM") + "." + tableName;
                mapping.keyField = rs.getString("COLUMN_NAME");
                mapping.labels = Collections.singleton(tableName);

                result.add(mapping);
            }
        }

        return result;
    }
}
