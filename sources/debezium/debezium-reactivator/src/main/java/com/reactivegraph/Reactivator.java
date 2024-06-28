package com.reactivegraph;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.reactivegraph.models.NodeMapping;
import com.reactivegraph.models.RelationalGraphMapping;
import io.debezium.config.Configuration;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.debezium.engine.format.Json;
import io.debezium.engine.spi.OffsetCommitPolicy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.Properties;

public class Reactivator {

    private static final Logger log = LoggerFactory.getLogger(Reactivator.class);

    public static void main(String[] args) throws IOException, SQLException {

        try {            
            var sourceId = System.getenv("SOURCE_ID");
            var publisher = new DebugPublisher(); //DaprChangePublisher(sourceId, pubsubName);

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
            //log.error(ex.getMessage());
            //Files.write(Path.of("/dev/termination-log"), ex.getMessage().getBytes());
            throw ex;
        }
    }



}
