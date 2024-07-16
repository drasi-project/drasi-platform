package com.drasi;

import io.debezium.annotation.ThreadSafe;
import io.debezium.relational.history.AbstractSchemaHistory;
import io.debezium.relational.history.HistoryRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Consumer;

@ThreadSafe
public final class NoOpSchemaHistory extends AbstractSchemaHistory {
    private static final Logger log = LoggerFactory.getLogger(NoOpSchemaHistory.class);

    public NoOpSchemaHistory() {
    }


    protected void storeRecord(HistoryRecord record) {
    }

    protected void recoverRecords(Consumer<HistoryRecord> records) {
    }

    public boolean storageExists() {
        return true;
    }

    public boolean exists() {
        return true;
    }

    public String toString() {
        return "noop";
    }
}

