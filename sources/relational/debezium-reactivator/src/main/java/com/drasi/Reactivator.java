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
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class Reactivator {

    private static final Logger log = LoggerFactory.getLogger(Reactivator.class);

    public static void main(String[] args) throws IOException, SQLException {

        try {
            var sourceId = System.getenv("SOURCE_ID");
            var connector = System.getenv("connector");
            var instanceId = System.getenv("INSTANCE_ID");
            SpringApplication app = new SpringApplication(Reactivator.class);
            Map<String, Object> defaultProperties = new HashMap<>();
            defaultProperties.put("server.port", "80");
            defaultProperties.put("drasi.sourceid", sourceId);
            defaultProperties.put("drasi.connector", connector);
            defaultProperties.put("drasi.instanceid", instanceId);
            defaultProperties.put("server.shutdown", "graceful");
            defaultProperties.put("spring.lifecycle.timeout-per-shutdown-phase", "20s");
            app.setDefaultProperties(defaultProperties);
            app.run(args);
        } catch (Exception ex) {
            log.error(ex.getMessage());
            Files.write(Path.of("/dev/termination-log"), ex.getMessage().getBytes());
            throw ex;
        }
    }



}
