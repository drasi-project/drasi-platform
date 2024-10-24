package com.drasi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.sql.SQLException;

@Configuration
public class AppConfig {

    @Value("${drasi.sourceid}")
    private String sourceId;

    @Value("${drasi.connector}")
    private String connector;

    @Autowired
    private ApplicationContext applicationContext;

    @Bean
    public ChangeMonitor changeMonitor() throws SQLException, IOException {

        var publisher = new DaprChangePublisher(sourceId);

        ChangeMonitor monitor;
        switch (System.getenv("connector")) {
            case "PostgreSQL":
                monitor = new PostgresChangeMonitor(sourceId, publisher, applicationContext);
                break;
            case "SQLServer":
                monitor = new SqlServerChangeMonitor(sourceId, publisher, applicationContext);
                break;
            default:
                throw new IllegalArgumentException("Unknown connector");
        }

        return monitor;
    }
}