package com.drasi;

import com.fasterxml.jackson.databind.JsonNode;
import com.drasi.models.RelationalGraphMapping;

public class PostgresChangeConsumer extends RelationalChangeConsumer {

    public PostgresChangeConsumer(RelationalGraphMapping mappings, ChangePublisher changePublisher) {
        super(mappings, changePublisher);
    }

    @Override
    protected long ExtractLsn(JsonNode sourceChange) {
        return sourceChange.get("lsn").asLong();
    }
}
