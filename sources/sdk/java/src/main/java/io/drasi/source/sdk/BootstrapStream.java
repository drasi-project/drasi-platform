package io.drasi.source.sdk;

import io.drasi.source.sdk.models.SourceElement;

import java.io.Closeable;
import java.util.List;

public interface BootstrapStream extends Closeable {
    List<String> validate();
    SourceElement next();
}
