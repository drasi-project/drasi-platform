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
