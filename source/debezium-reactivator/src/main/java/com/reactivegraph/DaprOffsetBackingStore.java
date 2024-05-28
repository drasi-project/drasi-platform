package com.reactivegraph;

import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;
import io.dapr.client.domain.SaveStateRequest;
import io.dapr.client.domain.State;
import io.dapr.utils.TypeRef;
import org.apache.kafka.connect.errors.ConnectException;
import org.apache.kafka.connect.runtime.WorkerConfig;
import org.apache.kafka.connect.storage.MemoryOffsetBackingStore;
import org.apache.kafka.connect.util.SafeObjectInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

public class DaprOffsetBackingStore extends MemoryOffsetBackingStore {
    private static final Logger log = LoggerFactory.getLogger(org.apache.kafka.connect.storage.FileOffsetBackingStore.class);

    private DaprClient client;
    private String stateStore;

    public DaprOffsetBackingStore() {
        this.client = new DaprClientBuilder()
            .build();
    }

    @Override
    public void configure(WorkerConfig config) {
        super.configure(config);
        stateStore = "rg-state"; //config.getString("offset.storage.dapr.statestore");
    }

    @Override
    public synchronized void start() {
        super.start();
        log.info("Starting DaprOffsetBackingStore");
        load();
    }

    @Override
    public synchronized void stop() {
        super.stop();
        log.info("Stopped DaprOffsetBackingStore");
    }

    private void load() {
        data = new HashMap<>();
        var resp = client.getState(stateStore, "offset", TypeRef.BYTE_ARRAY);
        var respValue = resp.block().getValue();

        if (respValue == null)
            return;

        if (respValue.length == 0)
            return;

        try (var ba = new ByteArrayInputStream(respValue)) {
            try (var is = new SafeObjectInputStream(ba)) {
                Object obj = is.readObject();
                if (!(obj instanceof HashMap))
                    throw new ConnectException("Expected HashMap but found " + obj.getClass());
                Map<byte[], byte[]> raw = (Map<byte[], byte[]>) obj;
                for (Map.Entry<byte[], byte[]> mapEntry : raw.entrySet()) {
                    ByteBuffer key = (mapEntry.getKey() != null) ? ByteBuffer.wrap(mapEntry.getKey()) : null;
                    ByteBuffer value = (mapEntry.getValue() != null) ? ByteBuffer.wrap(mapEntry.getValue()) : null;
                    data.put(key, value);
                }
            }
        } catch (IOException | ClassNotFoundException e) {
            throw new ConnectException(e);
        }
    }

    @Override
    protected void save() {
        log.info("Saving offset....");
        try (var ba = new ByteArrayOutputStream()) {
            try (ObjectOutputStream os = new ObjectOutputStream(ba)) {
                Map<byte[], byte[]> raw = new HashMap<>();
                for (Map.Entry<ByteBuffer, ByteBuffer> mapEntry : data.entrySet()) {
                    byte[] key = (mapEntry.getKey() != null) ? mapEntry.getKey().array() : null;
                    byte[] value = (mapEntry.getValue() != null) ? mapEntry.getValue().array() : null;
                    raw.put(key, value);
                }
                os.writeObject(raw);
            }

            var req = new SaveStateRequest(stateStore);
            req.setStates(new State("offset", data, null));
            client.saveState(stateStore, "offset", ba.toByteArray()).block();
        } catch (IOException e) {
            throw new ConnectException(e);
        }
    }
}

