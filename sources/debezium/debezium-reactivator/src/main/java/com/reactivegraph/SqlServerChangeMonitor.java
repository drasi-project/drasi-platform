package com.reactivegraph;

import com.reactivegraph.models.RelationalGraphMapping;
import io.debezium.config.Configuration;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.debezium.engine.format.Json;
import io.debezium.engine.spi.OffsetCommitPolicy;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Properties;

public class SqlServerChangeMonitor implements ChangeMonitor {
    private String sourceId;
    private ChangePublisher publisher;

    public SqlServerChangeMonitor(String sourceId, ChangePublisher publisher) {
        this.sourceId = sourceId;
        this.publisher = publisher;
    }

    public void run() throws IOException, SQLException {
        var tableListStr = System.getenv("tables");
        var tableList = tableListStr.split(",");

        var mappings = new RelationalGraphMapping();

        Configuration config = Configuration.create()
                .with("connector.class", "io.debezium.connector.sqlserver.SqlServerConnector")
                //.with("offset.storage", "com.reactivegraph.DaprOffsetBackingStore")
                .with("offset.storage", "org.apache.kafka.connect.storage.MemoryOffsetBackingStore")
                .with("offset.flush.interval.ms", 5000)
                .with("name", sourceId)
                .with("topic.prefix", CleanPublicationName(sourceId))
                .with("database.hostname", System.getenv("host"))
                .with("database.port", System.getenv("port"))
                .with("database.user", System.getenv("user"))
                .with("database.password", System.getenv("password"))
                .with("database.names", System.getenv("database"))
                .with("tombstones.on.delete", false)
                //.with("snapshot.mode", "no_data")
                .with("snapshot.mode", "configuration_based")
                .with("snapshot.mode.configuration.based.snapshot.schema", true)
                .with("snapshot.mode.configuration.based.start.stream", true)
                .with("snapshot.mode.configuration.based.snapshot.on.schema.error", true)

                .with("schema.history.internal", "io.debezium.relational.history.MemorySchemaHistory")
                .with("decimal.handling.mode", "double")
                .with("table.include.list", tableListStr).build();

        var sr = new SchemaReader(config);
        mappings.nodes = sr.ReadMappingsFromSchema(tableList);

        final Properties props = config.asProperties();

        try (DebeziumEngine<ChangeEvent<String, String>> engine = DebeziumEngine.create(Json.class)
                .using(props)
                .using(OffsetCommitPolicy.always())
                .notifying(new SqlServerChangeConsumer(mappings, publisher)).build()) {
            engine.run();
        }
    }

    private static String CleanPublicationName(String name) {
        return name.replace("-", "_");
    }
}
