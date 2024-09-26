package com.drasi;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

public interface ChangePublisher extends AutoCloseable {
    void Publish(List<JsonNode> changes);
}
