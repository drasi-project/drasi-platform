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
import com.drasi.models.RelationalGraphMapping;

public class SqlServerChangeConsumer extends RelationalChangeConsumer {

    public SqlServerChangeConsumer(RelationalGraphMapping mappings, ChangePublisher changePublisher) {
        super(mappings, changePublisher);
    }

    @Override
    protected long ExtractLsn(JsonNode sourceChange) {
        var lsn = sourceChange.get("change_lsn").asText();
        if ((lsn == null) || (lsn.isEmpty()))
            return 0;
        String[] parts = lsn.split(":");
        if (parts.length != 3)
            return 0;
        long vlfSeqNo = Long.parseLong(parts[0], 16);
        long logBlockOffset = Long.parseLong(parts[1], 16);
        long slotNo = Long.parseLong(parts[2], 16);
        long combinedLsn = (vlfSeqNo << 32) | (logBlockOffset << 16) | slotNo;

        return combinedLsn;
    }
}
