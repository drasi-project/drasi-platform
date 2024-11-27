package io.drasi.source.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.drasi.source.sdk.models.SourceChangeContainer;

public interface ChangePublisher extends AutoCloseable {
    void Publish(SourceChangeContainer change) throws JsonProcessingException;
}