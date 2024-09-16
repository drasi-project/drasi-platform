package com.drasi;

import com.fasterxml.jackson.databind.JsonNode;
import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;

import java.util.List;

public class DaprChangePublisher implements ChangePublisher {
    private DaprClient client;
    private String pubsubName;
    private String sourceId;

    public DaprChangePublisher(String sourceId) {
        this.sourceId = sourceId;

        this.pubsubName = System.getenv("PUBSUB");
        if (this.pubsubName == null)
            this.pubsubName = "drasi-pubsub";

        client = new DaprClientBuilder().build();
    }

    @Override
    public void Publish(List<JsonNode> changes) {
        client.publishEvent(pubsubName, sourceId + "-change", changes).block();
    }

    @Override
    public void close() throws Exception {
        client.close();
    }
}
