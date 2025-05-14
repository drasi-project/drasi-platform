package io.drasi.source.sdk;

import io.dapr.client.ObjectSerializer;
import io.dapr.serializer.DaprObjectSerializer;

public class StateSerializer extends ObjectSerializer implements DaprObjectSerializer {
  
    @Override
    public String getContentType() {
      return "application/octet-stream";
    }
  }