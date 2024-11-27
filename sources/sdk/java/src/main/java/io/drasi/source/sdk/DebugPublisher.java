package io.drasi.source.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.drasi.source.sdk.models.Converter;
import io.drasi.source.sdk.models.SourceChangeContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DebugPublisher implements ChangePublisher {
    private static final Logger log = LoggerFactory.getLogger(DebugPublisher.class);

    public DebugPublisher() {
    }

    @Override
    public void Publish(SourceChangeContainer change) throws JsonProcessingException {
        switch (change.op) {
            case I:
                log.info("Insert: {}", Converter.SourceInsertToJsonString(change.insert));
                break;
            case U:
                log.info("Update: {}", Converter.SourceUpdateToJsonString(change.update));
                break;
            case D:
                log.info("Delete: {}", Converter.SourceDeleteToJsonString(change.delete));
                break;
            default:
                throw new IllegalArgumentException("Invalid operation");
        }
    }

    @Override
    public void close() throws Exception {

    }
}