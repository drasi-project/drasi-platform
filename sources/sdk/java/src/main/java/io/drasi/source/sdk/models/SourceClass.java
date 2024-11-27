package io.drasi.source.sdk.models;

public class SourceClass {
    private String db;
    private long lsn;
    private Table table;
    private long tsMS;

    public String getDB() { return db; }
    public void setDB(String value) { this.db = value; }

    public long getLsn() { return lsn; }
    public void setLsn(long value) { this.lsn = value; }

    public Table getTable() { return table; }
    public void setTable(Table value) { this.table = value; }

    public long getTsMS() { return tsMS; }
    public void setTsMS(long value) { this.tsMS = value; }
}
