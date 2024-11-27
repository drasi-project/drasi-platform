package io.drasi.source.sdk.models;

import java.util.List;
import java.util.Map;

public class AfterClass {
    private String endID;
    private String id;
    private List<String> labels;
    private Map<String, Object> properties;
    private String startID;

    public String getEndID() { return endID; }
    public void setEndID(String value) { this.endID = value; }

    public String getID() { return id; }
    public void setID(String value) { this.id = value; }

    public List<String> getLabels() { return labels; }
    public void setLabels(List<String> value) { this.labels = value; }

    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> value) { this.properties = value; }

    public String getStartID() { return startID; }
    public void setStartID(String value) { this.startID = value; }
}
