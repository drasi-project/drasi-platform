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

public class SourceUpdate extends SourceChange {

    @Override
    protected Op getOp() {
        return Op.UPDATE;
    }

    public SourceUpdate(String id, long tsMS, JsonNode properties, Map<String, Object> metadata, List<String> labels, long sourceTsMS, long lsn) {
        super(id, tsMS, properties, metadata, labels, sourceTsMS, lsn);

    }

    public SourceUpdate(String id, long tsMS, JsonNode properties, Map<String, Object> metadata, List<String> labels, long sourceTsMS, long lsn, String startId, String endId) {
        super(id, tsMS, properties, metadata, labels, sourceTsMS, lsn, startId, endId);
    }
}
