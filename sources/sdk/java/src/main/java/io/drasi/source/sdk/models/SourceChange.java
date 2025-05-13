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

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import io.drasi.source.sdk.Reactivator;

public abstract class SourceChange {

    protected abstract Op getOp();

    private String id;
    private long reactivatorStartTsNs;
    private JsonNode properties;
    private Map<String, Object> metadata;
    private List<String> labels;
    private String startId;
    private String endId;
    private long sourceTsNS;
    private long reactivatorEndTsNs;
    private long lsn;
    private String sourceTable;


    protected SourceChange(String id, long reactivatorStartTsNs, JsonNode properties, Map<String, Object> metadata, List<String> labels, long sourceTsNS, long lsn) {
        this.id = id;
        this.reactivatorStartTsNs = reactivatorStartTsNs;
        this.properties = properties;
        this.metadata = metadata;
        this.labels = labels;
        this.sourceTsNS = sourceTsNS;
        this.reactivatorEndTsNs = 0; 
        this.lsn = lsn;
        this.sourceTable = "node";
    }

    protected SourceChange(String id, long reactivatorStartTsNs, JsonNode properties, Map<String, Object> metadata, List<String> labels, long sourceTsNS, long lsn, String startId, String endId) {
        this.id = id;
        this.reactivatorStartTsNs = reactivatorStartTsNs;
        this.properties = properties;
        this.metadata = metadata;
        this.labels = labels;
        this.startId = startId;
        this.endId = endId;
        this.sourceTsNS = sourceTsNS;
        this.reactivatorEndTsNs = 0;
        this.lsn = lsn;
        this.sourceTable = "rel";
    }

    public String toJson() {
        var rgSource = JsonNodeFactory.instance.objectNode();
        rgSource.put("db", Reactivator.SourceId());
        rgSource.put("table", sourceTable);
        rgSource.put("lsn", lsn);
        rgSource.put("ts_ns", sourceTsNS);

        var payload = JsonNodeFactory.instance.objectNode();
        payload.set("source", rgSource);
        switch (getOp()) {
            case INSERT, UPDATE:
                payload.set("after", ConvertProperties());
                break;
            case DELETE:
                payload.set("before", ConvertProperties());
                break;
        }

        var result = JsonNodeFactory.instance.objectNode();

        switch (getOp()) {
            case INSERT:
                result.put("op", "i");
                break;
            case UPDATE:
                result.put("op", "u");
                break;
            case DELETE:
                result.put("op", "d");
                break;
        }
        result.put("reactivatorStart_ns", reactivatorStartTsNs);
        result.put("reactivatorEnd_ns", reactivatorEndTsNs);
        result.set("payload", payload);

        return result.toString();
    }

    private JsonNode ConvertProperties() {
        var result = JsonNodeFactory.instance.objectNode();

        result.put("id", id);
        var lbls = JsonNodeFactory.instance.arrayNode();
        for (var lbl : labels)
            lbls.add(lbl);
        result.set("labels", lbls);

        if (properties != null) {
            var props = JsonNodeFactory.instance.objectNode();
            var pgFields = properties.fields();
            while (pgFields.hasNext()) {
                var field = pgFields.next();
                props.set(field.getKey(), field.getValue());
            }
            result.set("properties", properties);
        }

        if (startId != null) {
            result.put("startId", startId);
        }

        if (endId != null) {
            result.put("endId", endId);
        }

        return  result;
    }

    public void setReactivatorEndTsNs(long reactivatorEndTsNs) {
        this.reactivatorEndTsNs = reactivatorEndTsNs;
    }

    enum Op {
        INSERT,
        UPDATE,
        DELETE
    }
}
