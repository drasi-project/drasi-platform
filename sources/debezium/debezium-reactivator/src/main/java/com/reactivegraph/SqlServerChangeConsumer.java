package com.reactivegraph;

import com.fasterxml.jackson.databind.JsonNode;
import com.reactivegraph.models.RelationalGraphMapping;

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
