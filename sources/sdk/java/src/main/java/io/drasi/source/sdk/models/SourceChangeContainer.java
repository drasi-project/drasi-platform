package io.drasi.source.sdk.models;

public class SourceChangeContainer {

    public final SourceChangeOp op;
    public final SourceInsert insert;
    public final SourceUpdate update;
    public final SourceDelete delete;

    public SourceChangeContainer(SourceInsert insert) {
        this.op = SourceChangeOp.I;
        this.insert = insert;
        this.update = null;
        this.delete = null;
    }

    public SourceChangeContainer(SourceUpdate update) {
        this.op = SourceChangeOp.U;
        this.insert = null;
        this.update = update;
        this.delete = null;
    }

    public SourceChangeContainer(SourceDelete delete) {
        this.op = SourceChangeOp.D;
        this.insert = null;
        this.update = null;
        this.delete = delete;
    }

}
