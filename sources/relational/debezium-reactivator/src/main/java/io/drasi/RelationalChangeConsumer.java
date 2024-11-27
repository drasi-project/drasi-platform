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
                var drasiChange = ExtractNodeChanges(pgChange);
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

    private SourceChangeContainer ExtractNodeChanges(JsonNode sourceChange) {
        var pgPayload = sourceChange.path("payload");

        if (!pgPayload.has("op"))
            return null;

        var pgSource = pgPayload.path("source");
        var tableName = pgSource.path("schema").asText() + "." + pgSource.path("table").asText();

        if (!tableToNodeMap.containsKey(tableName))
            return null;

        var mapping = tableToNodeMap.get(tableName);
        var source = new SourceClass();
        source.setDB(Reactivator.SourceId());
        source.setTable(Table.NODE);
        source.setLsn(ExtractLsn(pgSource));
        source.setTsMS(pgSource.path("ts_ms").asLong());

        switch (pgPayload.path("op").asText()) {
            case "c":
                var si = new SourceInsert();
                si.setOp(SourceInsertOp.I);
                si.setTsMS(pgPayload.path("ts_ms").asLong());
                var sip = new SourceInsertPayload();
                sip.setSource(source);
                sip.setAfter(ConvertRow(pgPayload.path("after"), mapping));
                si.setPayload(sip);

                return new SourceChangeContainer(si);
            case "u":
                var su = new SourceUpdate();
                su.setOp(SourceUpdateOp.U);
                su.setTsMS(pgPayload.path("ts_ms").asLong());
                var sup = new SourceInsertPayload();
                sup.setSource(source);
                sup.setAfter(ConvertRow(pgPayload.path("after"), mapping));
                su.setPayload(sup);

                return new SourceChangeContainer(su);
            case "d":
                var sd = new SourceDelete();
                sd.setOp(SourceDeleteOp.D);
                sd.setTsMS(pgPayload.path("ts_ms").asLong());
                var sdp = new PayloadClass();
                sdp.setSource(source);
                sdp.setBefore(ConvertRow(pgPayload.path("before"), mapping));
                sd.setPayload(sdp);

                return new SourceChangeContainer(sd);
        }

        return null;
    }

    protected abstract long ExtractLsn(JsonNode sourceChange);

    private String ConvertOp(String op) {
        switch (op) {
            case "c":
                return "i";
        }
        return op;
    }

    private AfterClass ConvertRow(JsonNode pgRow, NodeMapping mapping) {
        var result = new AfterClass();
        var nodeId = SanitizeNodeId(mapping.tableName + ":" + pgRow.path(mapping.keyField).asText());
        if (pgRow.has(mapping.keyField)) {
            result.setID(nodeId);
            result.setLabels(mapping.labels.stream().toList());

            var properties = new HashMap<String, Object>();
            var pgFields = pgRow.fields();
            while (pgFields.hasNext()) {
                var field = pgFields.next();
                var value = field.getValue();
                switch (value.getNodeType()) {
                    case NULL:
                        properties.put(field.getKey(), null);
                        break;
                    case BOOLEAN:
                        properties.put(field.getKey(), value.asBoolean());
                        break;
                    case NUMBER:
                        properties.put(field.getKey(), value.asDouble());
                        break;
                    case STRING, BINARY:
                        properties.put(field.getKey(), value.asText());
                        break;
                    default:
                        return null;
                }
            }
            result.setProperties(properties);
        }

        return result;
    }

    private String SanitizeNodeId(String nodeId) {
        return nodeId.replace('.', ':');
    }
}
