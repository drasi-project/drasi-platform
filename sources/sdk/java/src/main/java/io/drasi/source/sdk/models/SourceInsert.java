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

package io.drasi.source.sdk.models;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

/**
 * Represents an insert operation in the source database, of either a node or relation.
 */
public class SourceInsert extends SourceChange {

    @Override
    protected Op getOp() {
        return Op.INSERT;
    }

    /**
     * Creates a new insert operation for a node with the given parameters.
     *
     * @param id                     The ID of the element.
     * @param reactivatorStartTsNs   The timestamp when the reactivator received the event in nanoseconds.
     * @param properties             The properties of the element.
     * @param metadata               The metadata of the element.
     * @param labels                 The labels of the element.
     * @param sourceTsNS             The timestamp of the event in the source database in nanoseconds.
     * @param sequenceNumber         The sequence number of the event in the source database.
     */
    public SourceInsert(String id, long reactivatorStartTsNs, JsonNode properties, Map<String, Object> metadata, List<String> labels, long sourceTsNS, long sequenceNumber) {
        super(id, reactivatorStartTsNs, properties, metadata, labels, sourceTsNS, sequenceNumber);

    }

    /**
     * Creates a new insert operation for a relation with the given parameters.
     *
     * @param id                    The ID of the element.
     * @param reactivatorStartTsNs  The timestamp when the reactivator received the event in nanoseconds.
     * @param properties            The properties of the element.
     * @param metadata              The metadata of the element.
     * @param labels                The labels of the element.
     * @param sourceTsNS            The timestamp of the event in the source database in nanoseconds.
     * @param sequenceNumber        The sequence number of the event in the source database.
     * @param startId               The ID of the start node.
     * @param endId                 The ID of the end node.
     */
    public SourceInsert(String id, long reactivatorStartTsNs, JsonNode properties, Map<String, Object> metadata, List<String> labels, long sourceTsNS, long sequenceNumber, String startId, String endId) {
        super(id, reactivatorStartTsNs, properties, metadata, labels, sourceTsNS, sequenceNumber, startId, endId);
    }
}
