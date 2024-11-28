package io.drasi.source.sdk;

import io.drasi.source.sdk.models.SourceElement;

import java.util.Iterator;
import java.util.List;

public interface BootstrapStream extends AutoCloseable {
    List<String> validate();
    SourceElement next();
}
