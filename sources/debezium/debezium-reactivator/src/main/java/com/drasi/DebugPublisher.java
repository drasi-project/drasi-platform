package com.drasi;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class DebugPublisher implements ChangePublisher {
    private static final Logger log = LoggerFactory.getLogger(ChangePublisher.class);

    public DebugPublisher() {
    }

    @Override
    public void Publish(List<JsonNode> changes) {
        log.info("Publishing: {}", changes.toString());
    }

    @Override
    public void close() throws Exception {

    }
}
