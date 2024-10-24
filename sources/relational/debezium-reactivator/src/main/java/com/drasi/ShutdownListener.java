package com.drasi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

@Component
public class ShutdownListener implements ApplicationListener<ContextClosedEvent> {

    private static final Logger log = LoggerFactory.getLogger(ShutdownListener.class);

    private final ChangeMonitor changeMonitor;

    @Autowired
    public ShutdownListener(@Qualifier("changeMonitor") ChangeMonitor changeMonitor) {
        this.changeMonitor = changeMonitor;
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        log.info("Reactivator is shutting down.");
        try {
            changeMonitor.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
