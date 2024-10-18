package com.drasi;

import com.drasi.models.RelationalGraphMapping;
import io.debezium.config.Configuration;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.debezium.engine.format.Json;
import io.debezium.engine.spi.OffsetCommitPolicy;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SqlServerChangeMonitor implements ChangeMonitor {
    private String sourceId;
    private ChangePublisher publisher;
    private ExecutorService executor;
    private DebeziumEngine<ChangeEvent<String, String>> engine;

    public SqlServerChangeMonitor(String sourceId, ChangePublisher publisher) {
        this.sourceId = sourceId;
        this.publisher = publisher;
        this.executor = Executors.newSingleThreadExecutor();
    }

    public void run() throws IOException, SQLException {
        var tableListStr = System.getenv("tables");
        var tableList = tableListStr.split(",");

        var mappings = new RelationalGraphMapping();

        Configuration config = Configuration.create()
                .with("connector.class", "io.debezium.connector.sqlserver.SqlServerConnector")
                .with("offset.storage", "com.drasi.DaprOffsetBackingStore")
                .with("offset.flush.interval.ms", 5000)
                .with("name", sourceId)
                .with("topic.prefix", CleanPublicationName(sourceId))
                .with("database.hostname", System.getenv("host"))
                .with("database.port", System.getenv("port"))
                .with("database.user", System.getenv("user"))
                .with("database.password", System.getenv("password"))
                .with("database.names", System.getenv("database"))
                .with("tombstones.on.delete", false)
                .with("snapshot.mode", "no_data")
                .with("schema.history.internal", "com.drasi.NoOpSchemaHistory")
                .with("decimal.handling.mode", "double")
                .with("table.include.list", tableListStr).build();

        var sr = new SchemaReader(config);
        mappings.nodes = sr.ReadMappingsFromSchema(tableList);

        final Properties props = config.asProperties();

        engine = DebeziumEngine.create(Json.class)
                .using(props)
                .using(OffsetCommitPolicy.always())
                .notifying(new SqlServerChangeConsumer(mappings, publisher)).build();

        executor.execute(engine);
    }

    public void close() throws Exception {
        engine.close();
        executor.shutdown();
        executor.awaitTermination(10, java.util.concurrent.TimeUnit.SECONDS);
    }

    private static String CleanPublicationName(String name) {
        return name.replace("-", "_");
    }
}
