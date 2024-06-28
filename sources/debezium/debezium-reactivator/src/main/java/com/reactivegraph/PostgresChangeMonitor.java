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

public class PostgresChangeMonitor implements ChangeMonitor {
    private String sourceId;
    private ChangePublisher publisher;

    public PostgresChangeMonitor(String sourceId, ChangePublisher publisher) {
        this.sourceId = sourceId;
        this.publisher = publisher;
    }

    public void run() throws IOException, SQLException {
        var tableListStr = System.getenv("tables");
        var tableList = tableListStr.split(",");

        var mappings = new RelationalGraphMapping();

        Configuration config = io.debezium.config.Configuration.create()
                .with("connector.class", "io.debezium.connector.postgresql.PostgresConnector")
                .with("offset.storage", "com.reactivegraph.DaprOffsetBackingStore")
                .with("offset.flush.interval.ms", 5000)
                .with("name", sourceId)
                .with("slot.name", "rg_" + CleanPublicationName(sourceId))
                .with("publication.name", "rg_" + CleanPublicationName(sourceId))
                .with("topic.prefix", CleanPublicationName(sourceId))
                .with("database.server.name", sourceId)
                .with("database.hostname", System.getenv("host"))
                .with("database.port", System.getenv("port"))
                .with("database.user", System.getenv("user"))
                .with("database.password", System.getenv("password"))
                .with("database.dbname", System.getenv("database"))
                .with("plugin.name", "pgoutput")
                .with("tombstones.on.delete", false)
                .with("publication.autocreate.mode", "filtered")
                .with("snapshot.mode", "never")
                .with("decimal.handling.mode", "double")
                .with("table.include.list", tableListStr).build();

        var sr = new SchemaReader(config);
        mappings.nodes = sr.ReadMappingsFromSchema(tableList);

        var init = new PostgresInitializer(config);
        init.Init(mappings.nodes);

        final Properties props = config.asProperties();

        try (DebeziumEngine<ChangeEvent<String, String>> engine = DebeziumEngine.create(Json.class)
                .using(props)
                .using(OffsetCommitPolicy.always())
                .notifying(new PostgresChangeConsumer(mappings, publisher)).build()) {
            engine.run();
        }
    }

    private static String CleanPublicationName(String name) {
        return name.replace("-", "_");
    }
}
