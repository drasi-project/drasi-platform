package com.reactivegraph;

import com.reactivegraph.models.NodeMapping;
import io.debezium.config.Configuration;
import io.debezium.connector.postgresql.PostgresConnectorConfig;
import io.debezium.connector.postgresql.connection.PostgresConnection;
import io.debezium.connector.sqlserver.SqlServerConnection;
import io.debezium.connector.sqlserver.SqlServerConnectorConfig;
import io.debezium.jdbc.JdbcConnection;
import io.debezium.relational.RelationalDatabaseConnectorConfig;

import java.sql.SQLException;
import java.util.*;

public class SchemaReader {

    public enum Connector {
        Postgres,
        SqlServer
    }

    private RelationalDatabaseConnectorConfig configuration;
    private Connector connector;


    public SchemaReader(Configuration config) {
        switch (config.getString("connector.class")) {
            case "io.debezium.connector.postgresql.PostgresConnector":
                configuration = new PostgresConnectorConfig(config);
                connector = Connector.Postgres;
                break;
            case "io.debezium.connector.sqlserver.SqlServerConnector":
                configuration = new SqlServerConnectorConfig(config);
                connector = Connector.SqlServer;
                break;
            default:
                throw new IllegalArgumentException("Unknown connector");
        }
    }

    private JdbcConnection GetConnection() {
        switch (connector) {
            case Postgres:
                return new PostgresConnection(configuration.getJdbcConfig(), "drasi");
            case SqlServer:
                return new SqlServerConnection((SqlServerConnectorConfig) configuration, null, new HashSet<>(), true);
            default:
                throw new IllegalArgumentException("Unknown connector");
        }
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
