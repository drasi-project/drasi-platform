package io.drasi.source.sdk.models;

import java.util.Map;

public class SourceInsert {
    private SourceInsertOp op;
    private SourceInsertPayload payload;
    private Map<String, Object> metadata;
    private long tsMS;

    public SourceInsertOp getOp() { return op; }
    public void setOp(SourceInsertOp value) { this.op = value; }

    public SourceInsertPayload getPayload() { return payload; }
    public void setPayload(SourceInsertPayload value) { this.payload = value; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> value) { this.metadata = value; }

    public long getTsMS() { return tsMS; }
    public void setTsMS(long value) { this.tsMS = value; }
}
