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
import io.drasi.models.NodeMapping;
import io.drasi.models.RelationalGraphMapping;
import io.drasi.models.RelationshipMapping;
import io.debezium.engine.ChangeEvent;
import io.debezium.engine.DebeziumEngine;
import io.drasi.source.sdk.ChangePublisher;
import io.drasi.source.sdk.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* Processes change events from relational databases and publishes them using a change publisher.
*/
public class RelationalChangeConsumer implements DebeziumEngine.ChangeConsumer<ChangeEvent<String, String>> {
    private static final Logger log = LoggerFactory.getLogger(RelationalChangeConsumer.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, NodeMapping> tableToNodeMap = new HashMap<>();
    private Map<String, RelationshipMapping> tableToRelMap = new HashMap<>();
    private final ChangePublisher changePublisher;
    private final DatabaseStrategy dbStrategy;
    
    /**
     * Creates a new RelationalChangeConsumer instance.
     * 
     * @param mappings Mappings between database tables and graph nodes.
     * @param changePublisher Publisher from Drasi Source SDK.
     * @param dbStrategy Strategy for the specific database in use.
     */
    public RelationalChangeConsumer(RelationalGraphMapping mappings, ChangePublisher changePublisher, DatabaseStrategy dbStrategy) {
        this.changePublisher = changePublisher;
        this.dbStrategy = dbStrategy;
        
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
    public void handleBatch(List<ChangeEvent<String, String>> records, 
                          DebeziumEngine.RecordCommitter<ChangeEvent<String, String>> committer) 
                          throws InterruptedException {
        for (var record : records) {
            long startTime = System.nanoTime();
            if (record.value() == null) {
                continue;
            }

            try {
                var sourceChange = objectMapper.readTree(record.value());
                var drasiChange = ExtractDrasiChange(sourceChange, startTime);
                if (drasiChange != null) {
                    changePublisher.Publish(drasiChange);
                } else {
                    log.warn("Change not processed: {}", sourceChange);
                }
            } catch (IOException e) {
                log.error("Error processing change record: {}", e.getMessage());
                throw new InterruptedException(e.getMessage());
            }

            committer.markProcessed(record);
        }

        committer.markBatchFinished();
    }

    private SourceChange ExtractDrasiChange(JsonNode sourceChange, long startTime) {
        var payload = sourceChange.path("payload");
        if (!payload.has("op")) {
            return null;
        }

        var source = payload.path("source");
        var tableName = dbStrategy.extractTableName(source);

        var mapping = tableToNodeMap.get(tableName);
        
        if (mapping == null) {
            log.warn("Table {} not found in mappings", tableName);
            return null;
        }

        var changeType = payload.path("op").asText();
        var item = getChangeData(payload, changeType);
        
        if (item == null) {
            log.warn("No change data found for type: {}", changeType);
            return null;
        }
    
        if (!item.has(mapping.keyField)) {
            log.warn("Key field {} not found in change data", mapping.keyField);
            return null;
        }

        var nodeId = createNodeId(mapping.tableName, item.path(mapping.keyField).asText());
        var sourceTsNS = source.path("ts_ns").asLong(); //In the source object, ts_ns indicates the time that the change was made in the database

        var lsn = dbStrategy.extractLsn(source);

        return switch (changeType) {
            case "c" -> new SourceInsert(nodeId, startTime, item, null, mapping.labels.stream().toList(), sourceTsNS, lsn);
            case "u" -> new SourceUpdate(nodeId, startTime, item, null, mapping.labels.stream().toList(), sourceTsNS, lsn);
            case "d" -> new SourceDelete(nodeId, startTime, null, mapping.labels.stream().toList(), sourceTsNS, lsn);
            default -> null;
        };
    }

    private JsonNode getChangeData(JsonNode payload, String changeType) {
        return switch (changeType) {
            case "c", "u" -> payload.path("after");
            case "d" -> payload.path("before");
            default -> null;
        };
    }

    private String createNodeId(String tableName, String keyFieldValue) {
        return (tableName + ":" + keyFieldValue).replace('.', ':');
    }
}