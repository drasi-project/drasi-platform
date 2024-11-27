package io.drasi.source.sdk.models;

import java.util.Map;

public class SourceChange {
    private Map<String, Object> metadata;
    private SourceChangeOp op;
    private long tsMS;

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> value) { this.metadata = value; }

    public SourceChangeOp getOp() { return op; }
    public void setOp(SourceChangeOp value) { this.op = value; }

    public long getTsMS() { return tsMS; }
    public void setTsMS(long value) { this.tsMS = value; }
}
