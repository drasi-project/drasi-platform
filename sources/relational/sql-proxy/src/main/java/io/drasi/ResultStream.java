package io.drasi;

import io.drasi.source.sdk.BootstrapStream;
import io.drasi.source.sdk.SourceProxy;
import io.drasi.source.sdk.models.BootstrapRequest;
import io.drasi.source.sdk.models.SourceElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.sql.*;
import java.util.*;

public class ResultStream implements BootstrapStream {

    private static final Logger log = LoggerFactory.getLogger(ResultStream.class);
    private final BootstrapRequest request;
    private final Connection connection;
    private final TableRegistry tableRegistry;

    private final Queue<TableCursor> cursors;

    public ResultStream(BootstrapRequest request) {
        try {
            this.tableRegistry = new TableRegistry();
            this.connection = getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        this.request = request;
        this.cursors = new LinkedList<>();

        for (var table : request.getNodeLabels()) {
            if (!tableRegistry.tableExists(table)) {
                log.warn("Table {} is not registered", table);
                continue;
            }
            String schemaName = tableRegistry.getSchemaName(table);
            cursors.add(new TableCursor(schemaName, table));
        }
    }

    public SourceElement next() {
        var cursor = cursors.peek();
        if (cursor == null)
            return null;

        var next = cursor.next(connection);
        while (next == null) {
            cursors.poll().close();
            cursor = cursors.peek();
            if (cursor == null)
                return null;

            next = cursor.next(connection);
        }
        
        return next;
    }

    @Override
    public void close() {
        log.info("Closing ResultStream");
        try {
            connection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private static Connection getConnection() throws SQLException {
        switch (SourceProxy.GetConfigValue("connector")) {
            case "PostgreSQL":
                var propsPG = new Properties();
                propsPG.setProperty("user", SourceProxy.GetConfigValue("user"));
                propsPG.setProperty("password", SourceProxy.GetConfigValue("password"));
                propsPG.setProperty("sslmode", SourceProxy.GetConfigValue("sslMode", "prefer"));

                return DriverManager.getConnection("jdbc:postgresql://" + SourceProxy.GetConfigValue("host") + ":" + SourceProxy.GetConfigValue("port") + "/" + SourceProxy.GetConfigValue("database"), propsPG);
            case "MySQL":
                var propsMySql = new Properties();
                propsMySql.setProperty("user", SourceProxy.GetConfigValue("user"));
                propsMySql.setProperty("password", SourceProxy.GetConfigValue("password"));
                propsMySql.setProperty("sslmode", SourceProxy.GetConfigValue("sslMode", "prefer"));

                var jdbcConnectionString = "jdbc:mysql://" + SourceProxy.GetConfigValue("host") + ":" + SourceProxy.GetConfigValue("port") + "/" + SourceProxy.GetConfigValue("database");

                return DriverManager.getConnection(jdbcConnectionString, propsMySql);
            case "SQLServer":
                var propsSQL = new Properties();
                String sqlUser = SourceProxy.GetConfigValue("user");
                String sqlPassword = SourceProxy.GetConfigValue("password");
                if (sqlUser != null) {
                    propsSQL.setProperty("user", sqlUser);
                }
                if (sqlPassword != null) {
                    propsSQL.setProperty("password", sqlPassword);
                }
                propsSQL.setProperty("encrypt", SourceProxy.GetConfigValue("encrypt"));
                propsSQL.setProperty("trustServerCertificate", SourceProxy.GetConfigValue("trustServerCertificate", "false"));
                propsSQL.setProperty("authentication", SourceProxy.GetConfigValue("authentication", "NotSpecified"));

                return DriverManager.getConnection("jdbc:sqlserver://"  + SourceProxy.GetConfigValue("host") + ":" + SourceProxy.GetConfigValue("port") + ";databaseName=" + SourceProxy.GetConfigValue("database"), propsSQL);
            default:
                throw new IllegalArgumentException("Unknown connector");
        }
    }

    @Override
    public List<String> validate() {
        var result = new ArrayList<String>();
        try {
            DatabaseMetaData metaData = connection.getMetaData();
            request.getNodeLabels().forEach(table -> {
                try {
                    ResultSet tables = metaData.getTables(null, null, table, new String[]{"TABLE"});
                    if (!tables.next()) {
                        result.add("Table " + table + " not found");
                    }
                } catch (SQLException e) {
                    result.add(e.getMessage());
                }
            });

        }
        catch (SQLException e) {
            return List.of(e.getMessage());
        }
        return result;
    }
}
