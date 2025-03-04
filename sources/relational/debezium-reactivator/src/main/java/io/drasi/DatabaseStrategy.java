package io.drasi;

import com.fasterxml.jackson.databind.JsonNode;
import io.debezium.config.Configuration;
import io.debezium.jdbc.JdbcConnection;
import io.drasi.models.NodeMapping;
import io.drasi.models.RelationalGraphMapping;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Interface for database-specific strategies.
 * Note: Might be broken down into smaller interfaces in the future.
 */
public interface DatabaseStrategy {
    /**
     * Gets a JDBC connection for the database
     * 
     * @param config Configuration for the database
     */
    JdbcConnection getConnection(Configuration config);

    /**
     * Gets the name of the configuration property for the tables list
     */
    String getTablesListConfigName();

    /**
     * Gets the name of the configuration property for the database name
     */
    String getDatabaseNameConfigName();

    /**
     * Gets the node mapping for a table
     * 
     * @param conn Connection to the database
     * @param schema Schema of the table
     * @param tableName Name of the table
     */
    NodeMapping getNodeMapping(Connection conn, String schema, String tableName) throws SQLException;

    /**
     * Extracts the LSN from a source change
     * 
     * @param sourceChange Source change
     */
    long extractLsn(JsonNode sourceChange);

    /**
     * Extracts the fully qualified table name from a source change
     * 
     * @param sourceChange Source change
     */
    String extractTableName(JsonNode sourceChange);

    /**
     * Creates a connector configuration for the database
     * 
     * @param baseConfig Base configuration
     */
    Configuration createConnectorConfig(Configuration baseConfig);

    /**
     * Performs any database-specific initialization (e.g., publications for Postgres)
     * 
     * @param config Configuration for the database
     * @param relationalGraphMapping Relational graph mapping
     */
    default void initialize(Configuration config, RelationalGraphMapping relationalGraphMapping) {
        // Optional initialization
    }
}