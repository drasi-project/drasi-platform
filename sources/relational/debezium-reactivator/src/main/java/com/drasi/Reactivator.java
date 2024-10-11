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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;

public class Reactivator {

    private static final Logger log = LoggerFactory.getLogger(Reactivator.class);

    public static void main(String[] args) throws IOException, SQLException {

        try {            
            var sourceId = System.getenv("SOURCE_ID");
            var publisher = new DaprChangePublisher(sourceId);

            ChangeMonitor monitor;
            switch (System.getenv("connector")) {
                case "PostgreSQL":
                    monitor = new PostgresChangeMonitor(sourceId, publisher);
                    break;
                case "SQLServer":
                    monitor = new SqlServerChangeMonitor(sourceId, publisher);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown connector");
            }
            monitor.run();

        } catch (Exception ex) {
            log.error(ex.getMessage());
            Files.write(Path.of("/dev/termination-log"), ex.getMessage().getBytes());
            throw ex;
        }
    }



}
