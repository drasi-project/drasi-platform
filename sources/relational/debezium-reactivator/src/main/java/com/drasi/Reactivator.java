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
