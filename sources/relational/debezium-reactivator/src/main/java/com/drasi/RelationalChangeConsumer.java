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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.drasi.models.NodeMapping;
import com.drasi.models.RelationalGraphMapping;
import com.drasi.models.RelationshipMapping;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

abstract class RelationalChangeConsumer implements DebeziumEngine.ChangeConsumer<ChangeEvent<String, String>> {

    private String sourceId = System.getenv("SOURCE_ID");
    private ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, List<NodeMapping>> tableToNodeMap;
    private Map<String, List<RelationshipMapping>> tableToRelMap;
    private ChangePublisher changePublisher;

    public RelationalChangeConsumer(RelationalGraphMapping mappings, ChangePublisher changePublisher) {
        this.changePublisher = changePublisher;
        tableToNodeMap = new HashMap<>();
        tableToRelMap = new HashMap<>();

        if (mappings.nodes != null)
            for (var nodeMapping : mappings.nodes) {
                tableToNodeMap.putIfAbsent(nodeMapping.tableName, new LinkedList<>());
                tableToNodeMap.get(nodeMapping.tableName).add(nodeMapping);
            }

        if (mappings.relationships != null)
            for (var relMapping : mappings.relationships) {
                tableToRelMap.putIfAbsent(relMapping.tableName, new LinkedList<>());
                tableToRelMap.get(relMapping.tableName).add(relMapping);
            }
    }

    @Override
    public void handleBatch(List<ChangeEvent<String, String>> records, DebeziumEngine.RecordCommitter<ChangeEvent<String, String>> committer) throws InterruptedException {
        for (var record: records) {

            if (record.value() == null)
                return;

            try {
                var pgChange = objectMapper.readTree(record.value());
                var rgChanges = ExtractNodeChanges(pgChange);
                // TODO: extract relationship changes
                changePublisher.Publish(rgChanges);
            } catch (IOException e) {
                throw new InterruptedException(e.getMessage());
            }
            committer.markProcessed(record);
        }
        committer.markBatchFinished();
    }

    private List<JsonNode> ExtractNodeChanges(JsonNode sourceChange) {
        var result = new ArrayList<JsonNode>();
        var pgPayload = sourceChange.path("payload");

        if (!pgPayload.has("op"))
            return result;

        var pgSource = pgPayload.path("source");
        var tableName = pgSource.path("schema").asText() + "." + pgSource.path("table").asText();

        if (!tableToNodeMap.containsKey(tableName))
            return result;

        for (var mapping : tableToNodeMap.get(tableName)) {
            var rgSource = JsonNodeFactory.instance.objectNode();
            rgSource.put("db", sourceId);
            rgSource.put("table", "node");
            rgSource.put("lsn", ExtractLsn(pgSource));
            rgSource.put("ts_ms", pgSource.path("ts_ms").asLong());
            rgSource.put("ts_sec", pgSource.path("ts_ms").asLong() / 1000);

            var rgAfter = ConvertRow(pgPayload.path("after"), mapping);
            var rgBefore = ConvertRow(pgPayload.path("before"), mapping);

            var rgPayload = JsonNodeFactory.instance.objectNode();
            rgPayload.set("source", rgSource);
            rgPayload.set("before", rgBefore);
            rgPayload.set("after", rgAfter);

            var rgChange = JsonNodeFactory.instance.objectNode();
            rgChange.put("op", ConvertOp(pgPayload.path("op").asText()));
            rgChange.put("ts_ms", pgPayload.path("ts_ms").asLong());
            rgChange.set("payload", rgPayload);

            result.add(rgChange);
        }

        return result;
    }

    protected abstract long ExtractLsn(JsonNode sourceChange);

    private String ConvertOp(String op) {
        switch (op) {
            case "c":
                return "i";
        }
        return op;
    }

    private JsonNode ConvertRow(JsonNode pgRow, NodeMapping mapping) {
        var result = JsonNodeFactory.instance.objectNode();
        var nodeId = SanitizeNodeId(mapping.tableName + ":" + pgRow.path(mapping.keyField).asText());
        if (pgRow.has(mapping.keyField)) {
            result.put("id", nodeId);

            var labels = JsonNodeFactory.instance.arrayNode();
            for (var lbl : mapping.labels)
                labels.add(lbl);
            result.set("labels", labels);

            var properties = JsonNodeFactory.instance.objectNode();
            var pgFields = pgRow.fields();
            while (pgFields.hasNext()) {
                var field = pgFields.next();
                properties.set(field.getKey(), field.getValue());
            }
            result.set("properties", properties);
        }

        return  result;
    }

    private String SanitizeNodeId(String nodeId) {
        return nodeId.replace('.', ':');
    }
}
