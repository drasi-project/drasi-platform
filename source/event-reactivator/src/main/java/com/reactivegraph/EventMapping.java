package com.reactivegraph;

import java.util.List;

public class EventMapping {

    private List<Mutation> mutations;

    public EventMapping() {

    }

    public EventMapping(List<Mutation> mutations) {
        this.mutations = mutations;
    }

    public List<Mutation> getMutations() {
        return mutations;
    }

    public void setMutations(List<Mutation> mutations) {
        this.mutations = mutations;
    }
}
