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

import io.drasi.databases.MySql;
import io.drasi.databases.PostgreSql;
import io.drasi.databases.SqlServer;
import io.drasi.source.sdk.ChangeMonitor;
import io.drasi.source.sdk.Reactivator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.SQLException;

public class DebeziumReactivator {

    private static final Logger log = LoggerFactory.getLogger(DebeziumReactivator.class);

    public static void main(String[] args) throws IOException, SQLException {

        log.info("Starting Debezium Reactivator");

        DatabaseStrategy strategy = switch (Reactivator.GetConfigValue("connector")) {
            case "PostgreSQL" -> new PostgreSql();
            case "SQLServer" -> new SqlServer();
            case "MySQL" -> new MySql();
            default -> throw new IllegalArgumentException("Unknown connector");
        };

        ChangeMonitor monitor = new RelationalChangeMonitor(strategy);

        var reactivator = Reactivator.builder()
                .withChangeMonitor(monitor)
                .withDeprovisionHandler((statestore) -> statestore.delete("offset"))
                .build();

        reactivator.start();
    }

}
