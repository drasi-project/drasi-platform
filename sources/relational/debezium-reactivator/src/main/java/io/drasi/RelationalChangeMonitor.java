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

package io.drasi;

import io.drasi.models.NodeMapping;
import io.drasi.models.RelationalGraphMapping;
import io.drasi.models.RelationshipMapping;
import io.debezium.config.Configuration;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.debezium.engine.format.Json;
import io.debezium.engine.spi.OffsetCommitPolicy;
import io.drasi.source.sdk.ChangeMonitor;
import io.drasi.source.sdk.ChangePublisher;
import io.drasi.source.sdk.Reactivator;
import io.drasi.source.sdk.StateStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

/**
* Monitors database changes using Debezium and publishes them through a change consumer.
*/
public class RelationalChangeMonitor implements ChangeMonitor {
    private static final Logger log = LoggerFactory.getLogger(RelationalChangeMonitor.class);
    private final DatabaseStrategy dbStrategy;
    private DebeziumEngine<ChangeEvent<String, String>> engine;

    /**
    * Creates a new RelationalChangeMonitor.
    *
    * @param dbStrategy Strategy for the specific database in use
    */
    public RelationalChangeMonitor(DatabaseStrategy dbStrategy) {
        this.dbStrategy = dbStrategy;
    }

    @Override
    public void run(ChangePublisher changePublisher, StateStore stateStore) throws Exception {
        var baseConfig = createBaseConfig();
        var connectorConfig = dbStrategy.createConnectorConfig(baseConfig);

        var mappings = createRelationalGraphMapping(connectorConfig);
        dbStrategy.initialize(connectorConfig, mappings);
        startEngine(changePublisher, connectorConfig, mappings);
    }

    @Override
    public void close() throws Exception {
        if (engine != null) {
            engine.close();
        }
    }

    private Configuration createBaseConfig()  {
        var sourceId = Reactivator.SourceId();
        var cleanSourceId = sourceId.replace("-", "_");

        // Some relational stores offer alternate authentication options, in which case theses are set to empty string.
        var dbUser = Reactivator.GetConfigValue("user", "");
        var dbPassword = Reactivator.GetConfigValue("password", "");
        
        var dbHost = Reactivator.GetConfigValue("host");
        if (dbHost == null || dbHost.isEmpty())
            Reactivator.TerminalError(new IllegalArgumentException("Database host is required."));

        var dbPort = Reactivator.GetConfigValue("port");
        if (dbPort == null || dbPort.isEmpty())
            Reactivator.TerminalError(new IllegalArgumentException("Database port is required."));

        var tableListStr = Reactivator.GetConfigValue("tables");
        if (tableListStr == null || tableListStr.isEmpty())
            Reactivator.TerminalError(new IllegalArgumentException("Tables are required."));

        var dbName = Reactivator.GetConfigValue("database");
        if (dbName == null || dbName.isEmpty())
            Reactivator.TerminalError(new IllegalArgumentException("Database name is required."));

        var databaseNameConfigStr = dbStrategy.getDatabaseNameConfigName();
        var tableListConfigStr = dbStrategy.getTablesListConfigName();

        return Configuration.create()
                // Name of the database from which to stream the changes.
                .with(databaseNameConfigStr, dbName)
                // List of tables to include in the connector.
                .with(tableListConfigStr, tableListStr)
                // Registers custom converters in a comma-separated list.
                .with("converters", "temporalConverter")
                // Hostname of the database server.
                .with("database.hostname", dbHost)
                // Password to be used when connecting to the database server.
                .with("database.password", dbPassword)
                // Port of the database server.
                .with("database.port", dbPort)
                // Username to be used when connecting to the database server.
                .with("database.user", dbUser)
                // Represent all DECIMAL, NUMERIC and MONEY values as `doubles`.
                .with("decimal.handling.mode", "double")
                // Retry a fixed number of times. Default is -1 (infinite).
                .with("errors.max.retries", "10")
                // Unique name for the connector instance.
                .with("name", cleanSourceId)
                // Interval at which to try committing offsets. Default is 1 minute.
                .with("offset.flush.interval.ms", 5000)
                // Class responsible for persistence of connector offsets.
                .with("offset.storage", "io.drasi.OffsetBackingStore")
                // Class responsible for persistence of database schema history.
                .with("schema.history.internal", "io.drasi.NoOpSchemaHistory")
                // Define custom converter for temporal types.
                .with("temporalConverter.type", "io.drasi.TemporalConverter")
                // Determine the type for temporal types based on DB column's type.
                // This ensures that all TIME fields captured as microseconds.
                .with("time.precision.mode", "adaptive_time_microseconds")
                // No subsequent tombstone events will be generated for delete events.
                .with("tombstones.on.delete", false)
                // Used as a namespace for the connector storage.
                .with("topic.prefix", cleanSourceId)

                .with("errors.max.retries", "3")
            .build();
    }

    private void startEngine(ChangePublisher changePublisher, Configuration config, RelationalGraphMapping mappings) {
        final Properties props = config.asProperties();
        engine = DebeziumEngine.create(Json.class)
                .using(props)
                .using(OffsetCommitPolicy.always())                
                .using((success, message, error) -> {
                    if (!success && error != null) {
                        log.error("Error in Debezium engine: {}", error.getMessage());
                        Reactivator.TerminalError(error);
                    }
                })
                .notifying(new RelationalChangeConsumer(mappings, changePublisher, dbStrategy))
                .build();

        engine.run();
    }

    private RelationalGraphMapping createRelationalGraphMapping(Configuration config) {

        var result = new RelationalGraphMapping();
        result.nodes = readNodeMappingsFromSchema(config);
        result.relationships = readRelationshipMappingsFromSchema(config);

        return result;
    }

    private List<RelationshipMapping> readRelationshipMappingsFromSchema(Configuration config) {
        return Collections.emptyList();
    }

    private List<NodeMapping> readNodeMappingsFromSchema(Configuration config) {
        var tableNames = config.getString(dbStrategy.getTablesListConfigName());
        String[] tables = tableNames.split(",");
        var result = new LinkedList<NodeMapping>();
        
        try (var conn = dbStrategy.getConnection(config);
            var connection = conn.connection()) {
                
            for (var table : tables) {
                table = table.trim();
                String schemaName = null;
                String tableName = table;
                
                if (table.contains(".")) {
                    var parts = table.split("\\.");
                    schemaName = parts[0];
                    tableName = parts[1];
                }

                var nodeMapping = dbStrategy.getNodeMapping(connection, schemaName, tableName);
                result.add(nodeMapping);
            }
        } catch (SQLException e) {
            Reactivator.TerminalError(e);
        }

        return result;
    }
}