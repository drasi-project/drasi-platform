package io.drasi.source.sdk.models;

import java.util.Map;

public class SourceDelete {
    private SourceDeleteOp op;
    private PayloadClass payload;
    private Map<String, Object> metadata;
    private long tsMS;

    public SourceDeleteOp getOp() { return op; }
    public void setOp(SourceDeleteOp value) { this.op = value; }

    public PayloadClass getPayload() { return payload; }
    public void setPayload(PayloadClass value) { this.payload = value; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> value) { this.metadata = value; }

    public long getTsMS() { return tsMS; }
    public void setTsMS(long value) { this.tsMS = value; }
}
