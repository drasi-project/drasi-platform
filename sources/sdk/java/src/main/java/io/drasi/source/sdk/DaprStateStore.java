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
        this.client = new DaprClientBuilder()
            .withStateSerializer(new StateSerializer())
            .build();
        this.client.waitForSidecar(3000).block();
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
        var resultValue = result.getValue();
        if (resultValue != null && resultValue.length == 0) {
            return null;
        }
        return resultValue;
    }

    @Override
    public void delete(String key) {
        log.debug("Deleting key {} from state store {}", key, stateStoreName);
        client.deleteState(stateStoreName, key).block();
    }
}
