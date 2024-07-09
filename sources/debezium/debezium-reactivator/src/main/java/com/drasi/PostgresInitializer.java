package com.drasi;

import com.drasi.models.NodeMapping;
import io.debezium.config.Configuration;
import io.debezium.connector.postgresql.PostgresConnectorConfig;
import io.debezium.connector.postgresql.connection.PostgresConnection;
import io.debezium.jdbc.JdbcConfiguration;
import io.debezium.jdbc.JdbcConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PostgresInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(PostgresInitializer.class);
    private JdbcConfiguration configuration;
    private String publicationName = "dbz_publication";

    public PostgresInitializer(Configuration config) {
        configuration = new PostgresConnectorConfig(config).getJdbcConfig();
        if (config.hasKey("publication.name"))
            publicationName = config.getString("publication.name");
    }

    private JdbcConnection GetConnection() {
        return new PostgresConnection(configuration, "drasi");
    }

    public void Init(List<NodeMapping> mappings) throws SQLException {
        try (var conn = GetConnection().connection()) {
            if (!PublicationExists(conn))
                return;
            var currentTables = GetPublicationTables(conn);
            var expectedTables = mappings.stream().map(x -> x.tableName).collect(Collectors.toSet());

            if (!currentTables.containsAll(expectedTables) || !expectedTables.containsAll(currentTables)) {
                LOGGER.warn("Publication " + publicationName + " does not match config");
                SetPublicationTables(conn, mappings);
            }
        }
    }

    private Set<String> GetPublicationTables(Connection conn) throws SQLException {
        var result = new HashSet<String>();
        var stmt = conn.prepareStatement("select * from pg_publication_tables where pubname = ?");
        stmt.setString(1, publicationName);
        var rs = stmt.executeQuery();
        while (rs.next()) {
            result.add(rs.getString("schemaname") + "." + rs.getString("tablename"));
        }
        rs.close();
        stmt.close();
        return result;
    }

    private boolean PublicationExists(Connection conn) throws SQLException {
        var stmt = conn.prepareStatement("select * from pg_publication where pubname = ?");
        stmt.setString(1, publicationName);
        var rs = stmt.executeQuery();
        var result = rs.next();
        rs.close();
        stmt.close();
        return result;
    }

    private void SetPublicationTables(Connection conn, List<NodeMapping> mappings) throws SQLException {
        var tableList = "";
        for (var mapping : mappings) {
            if (tableList == "")
                tableList += FormatTableName(mapping.tableName);
            else
                tableList += ", " + FormatTableName(mapping.tableName);
        }

        var stmt = conn.prepareStatement("ALTER PUBLICATION \"" + publicationName + "\" SET TABLE " + tableList);
        stmt.execute();
        stmt.close();
        LOGGER.info("Updated publication " + publicationName);
    }

    private String FormatTableName(String name) {
        if (!name.contains("."))
            return "\"" + name + "\"";
        var comps = name.split("\\.");
        return comps[0] + "." + "\"" + comps[1] + "\"";
    }
}
