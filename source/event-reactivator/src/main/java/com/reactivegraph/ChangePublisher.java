package com.reactivegraph;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Collection;
import java.util.List;

public interface ChangePublisher extends AutoCloseable {
    void Publish(Collection<ObjectNode> changes);
}