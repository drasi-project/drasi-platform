package com.reactivegraph;

public class Mutation {
    private String key;
    private String value;
    private String mutation;

    public Mutation() {
    }

    public Mutation(String key, String value, String mutation) {
        this.key = key;
        this.value = value;
        this.mutation = mutation;
    }



    public String getMutation() {
        return mutation;
    }

    public void setMutation(String mutation) {
        this.mutation = mutation;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
