package io.drasi.source.sdk.models;

public class SourceInsertPayload {
    private AfterClass after;
    private SourceClass source;

    public AfterClass getAfter() { return after; }
    public void setAfter(AfterClass value) { this.after = value; }

    public SourceClass getSource() { return source; }
    public void setSource(SourceClass value) { this.source = value; }
}
