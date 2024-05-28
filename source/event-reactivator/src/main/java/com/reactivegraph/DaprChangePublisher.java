package com.reactivegraph;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;

import java.util.Collection;
import java.util.List;

public class DaprChangePublisher implements ChangePublisher {
    private DaprClient client;
    private String pubsubName;
    private String sourceId;

    public DaprChangePublisher(String sourceId, String pubsubName) {
        this.sourceId = sourceId;
        this.pubsubName = pubsubName;
        client = new DaprClientBuilder().build();
    }

    @Override
    public void Publish(Collection<ObjectNode> changes) {
        client.publishEvent(pubsubName, sourceId + "-change", changes).block();
    }

    @Override
    public void close() throws Exception {
        client.close();
    }
}
