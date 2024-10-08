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
