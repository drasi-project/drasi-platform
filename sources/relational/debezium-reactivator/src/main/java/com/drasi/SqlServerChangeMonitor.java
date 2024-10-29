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

package com.drasi;

import com.drasi.models.RelationalGraphMapping;
import io.debezium.config.Configuration;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.debezium.engine.format.Json;
import io.debezium.engine.spi.OffsetCommitPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.Properties;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SqlServerChangeMonitor implements ChangeMonitor {
    private String sourceId;
    private ChangePublisher publisher;
    private ExecutorService executor;
    private DebeziumEngine<ChangeEvent<String, String>> engine;
    private ApplicationContext context;
    private static final Logger log = LoggerFactory.getLogger(SqlServerChangeMonitor.class);

    public SqlServerChangeMonitor(String sourceId, ChangePublisher publisher, ApplicationContext context) {
        this.sourceId = sourceId;
        this.publisher = publisher;
        this.context = context;
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
                .with("time.precision.mode", "adaptive_time_microseconds")
                .with("converters", "temporalConverter")
                .with("temporalConverter.type", "com.drasi.TemporalConverter")
                .with("table.include.list", tableListStr).build();

        var sr = new SchemaReader(config);
        mappings.nodes = sr.ReadMappingsFromSchema(tableList);

        final Properties props = config.asProperties();

        engine = DebeziumEngine.create(Json.class)
                .using(props)
                .using(OffsetCommitPolicy.always())
                .notifying(new SqlServerChangeConsumer(mappings, publisher)).build();

        executor.submit(() -> {
            try {
                engine.run();
            } catch (Exception e) {
                try {
                    Files.write(Path.of("/dev/termination-log"), e.getMessage().getBytes());
                } catch (IOException ex) {
                    log.error(ex.getMessage());
                }
                SpringApplication.exit(this.context, () -> 1);
            }
        });
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
