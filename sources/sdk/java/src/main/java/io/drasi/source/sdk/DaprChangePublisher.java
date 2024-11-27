package io.drasi.source.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;
import io.drasi.source.sdk.models.Converter;
import io.drasi.source.sdk.models.SourceChangeContainer;

class DaprChangePublisher implements ChangePublisher {
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
    public void Publish(SourceChangeContainer change) throws JsonProcessingException {

        String data;

        switch (change.op) {
            case I:
                data = Converter.SourceInsertToJsonString(change.insert);
                break;
            case U:
                data = Converter.SourceUpdateToJsonString(change.update);
                break;
            case D:
                data = Converter.SourceDeleteToJsonString(change.delete);
                break;
            default:
                throw new IllegalArgumentException("Invalid operation");
        }

        var changeList = "[" + data + "]";

        client.publishEvent(pubsubName, sourceId + "-change", changeList.getBytes()).block();
    }

    @Override
    public void close() throws Exception {
        client.close();
    }
}
