package com.drasi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.SQLException;

@Component
public class AppLifecycle implements SmartLifecycle {

    private static final Logger log = LoggerFactory.getLogger(AppLifecycle.class);
    private boolean isRunning = false;

    private final ChangeMonitor changeMonitor;

    @Autowired
    public AppLifecycle(@Qualifier("changeMonitor") ChangeMonitor changeMonitor) {
        this.changeMonitor = changeMonitor;
    }

    @Override
    public void start() {
        try {
            log.info("Reactivator is starting.");
            changeMonitor.run();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        isRunning = true;

    }

    @Override
    public void stop() {
        log.info("Reactivator is stopping.");
        try {
            changeMonitor.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        isRunning = false;
    }

    @Override
    public boolean isRunning() {
        return isRunning;
    }

    @Override
    public int getPhase() {
        return 0; // Defines the phase in which this component should start
    }
}
