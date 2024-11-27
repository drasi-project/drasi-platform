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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.drasi.models.NodeMapping;
import io.drasi.models.RelationalGraphMapping;
import io.drasi.models.RelationshipMapping;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.drasi.source.sdk.ChangePublisher;
import io.drasi.source.sdk.Reactivator;
import io.drasi.source.sdk.models.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

abstract class RelationalChangeConsumer implements DebeziumEngine.ChangeConsumer<ChangeEvent<String, String>> {

    private ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, NodeMapping> tableToNodeMap;
    private Map<String, RelationshipMapping> tableToRelMap;
    private ChangePublisher changePublisher;

    public RelationalChangeConsumer(RelationalGraphMapping mappings, ChangePublisher changePublisher) {
        this.changePublisher = changePublisher;
        tableToNodeMap = new HashMap<>();
        tableToRelMap = new HashMap<>();

        if (mappings.nodes != null)
            for (var nodeMapping : mappings.nodes) {
                tableToNodeMap.putIfAbsent(nodeMapping.tableName, nodeMapping);
            }

        if (mappings.relationships != null)
            for (var relMapping : mappings.relationships) {
                tableToRelMap.putIfAbsent(relMapping.tableName, relMapping);
            }
    }

    @Override
    public void handleBatch(List<ChangeEvent<String, String>> records, DebeziumEngine.RecordCommitter<ChangeEvent<String, String>> committer) throws InterruptedException {
        for (var record: records) {

            if (record.value() == null)
                return;

            try {
                var pgChange = objectMapper.readTree(record.value());
                var drasiChange = ExtractNodeChange(pgChange);
                if (drasiChange != null) {
                    changePublisher.Publish(drasiChange);
                }
            } catch (IOException e) {
                throw new InterruptedException(e.getMessage());
            }
            committer.markProcessed(record);
        }
        committer.markBatchFinished();
    }

    private SourceChange ExtractNodeChange(JsonNode sourceChange) {
        var pgPayload = sourceChange.path("payload");

        if (!pgPayload.has("op"))
            return null;

        var pgSource = pgPayload.path("source");
        var tableName = pgSource.path("schema").asText() + "." + pgSource.path("table").asText();

        if (!tableToNodeMap.containsKey(tableName))
            return null;

        var mapping = tableToNodeMap.get(tableName);

        JsonNode item;
        switch (pgPayload.path("op").asText()) {
            case "c", "u":
                item = pgPayload.path("after");
                break;
            case "d":
                item = pgPayload.path("before");
                break;
            default:
                return null;
        }
        var nodeId = SanitizeNodeId(mapping.tableName + ":" + item.path(mapping.keyField).asText());
        if (!item.has(mapping.keyField)) {
            return null;
        }
        var tsMs = pgPayload.path("ts_ms").asLong();

        switch (pgPayload.path("op").asText()) {
            case "c":
                return new SourceInsert(nodeId, tsMs, item, null, mapping.labels.stream().toList(), tsMs, ExtractLsn(pgSource));
            case "u":
                return new SourceUpdate(nodeId, tsMs, item, null, mapping.labels.stream().toList(), tsMs, ExtractLsn(pgSource));
            case "d":
                return new SourceDelete(nodeId, tsMs, item, null, mapping.labels.stream().toList(), tsMs, ExtractLsn(pgSource));
        }

        return null;
    }

    protected abstract long ExtractLsn(JsonNode sourceChange);

    private String SanitizeNodeId(String nodeId) {
        return nodeId.replace('.', ':');
    }
}
