package io.drasi.source.sdk;

import io.drasi.source.sdk.models.SourceElement;

import java.io.Closeable;
import java.util.List;

/**
 * Represents a stream of nodes and relations to bootstrap a new query with.
 */
public interface BootstrapStream extends Closeable {

    /**
     * Validate the bootstrap request.
     *
     * @return A list of validation errors, or an empty list if the request is valid.
     */
    List<String> validate();

    /**
     * Get the next element in the bootstrap stream.
     *
     * @return The next element, or null if there are no more elements.
     */
    SourceElement next();
}
