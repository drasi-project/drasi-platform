/*
 * Copyright 2024 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.drasi;

import io.drasi.source.sdk.StateStore;
import io.drasi.source.sdk.StateStoreFactory;
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
import java.util.Set;

public class OffsetBackingStore extends MemoryOffsetBackingStore {
    private static final Logger log = LoggerFactory.getLogger(OffsetBackingStore.class);

    private StateStore stateStore;

    public OffsetBackingStore() {
        stateStore = StateStoreFactory.getInstance();
    }

    @Override
    public void configure(WorkerConfig config) {
        super.configure(config);
    }

    @Override
    public synchronized void start() {
        super.start();
        log.info("Starting DaprOffsetBackingStore");

        var instanceId = System.getenv("INSTANCE_ID").getBytes();
        var resp = stateStore.get("instance_id");

        if (resp == null || !resp.equals(instanceId)) {
            log.info("Instance ID mismatch. Clearing offset store.");
            stateStore.delete("offset");
            stateStore.put("instance_id", instanceId);
        }

        load();
    }

    @Override
    public synchronized void stop() {
        super.stop();
        log.info("Stopped DaprOffsetBackingStore");
    }

    private void load() {
        data = new HashMap<>();
        var resp = stateStore.get("offset");

        if (resp == null)
            return;

        if (resp.length == 0)
            return;

        try (var ba = new ByteArrayInputStream(resp)) {
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

            stateStore.put("offset", ba.toByteArray());
        } catch (IOException e) {
            throw new ConnectException(e);
        }
    }

    @Override
    public Set<Map<String, Object>> connectorPartitions(String s) {
        return Set.of();
    }
}

