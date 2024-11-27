package io.drasi.source.sdk;

import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;
import io.dapr.utils.TypeRef;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class DaprStateStore implements StateStore {

    private static final Logger log = LoggerFactory.getLogger(DaprStateStore.class);
    private DaprClient client;
    private final String stateStoreName;

    public DaprStateStore() {
        var stateStoreName = System.getenv("STATE_STORE_NAME");
        this.stateStoreName = stateStoreName != null ? stateStoreName : "drasi-state";
        this.client = new DaprClientBuilder().build();
    }

    @Override
    public void put(String key, byte[] value) {
        log.debug("Putting key {} into state store {}", key, stateStoreName);
        client.saveState(stateStoreName, key, value).block();
    }

    @Override
    public byte[] get(String key) {
        log.debug("Getting key {} from state store {}", key, stateStoreName);
        var result = client.getState(stateStoreName, key, TypeRef.BYTE_ARRAY).block();
        return result.getValue();
    }

    @Override
    public void delete(String key) {
        log.debug("Deleting key {} from state store {}", key, stateStoreName);
        client.deleteState(stateStoreName, key).block();
    }
}
