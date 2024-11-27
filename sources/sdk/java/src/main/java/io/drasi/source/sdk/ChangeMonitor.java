package io.drasi.source.sdk;

import java.util.concurrent.Callable;

public interface ChangeMonitor extends AutoCloseable {
    void run(ChangePublisher publisher, StateStore stateStore) throws Exception;
}
