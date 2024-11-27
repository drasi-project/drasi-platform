package io.drasi.source.sdk;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.HttpHandler;
import io.undertow.server.HttpServerExchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class Reactivator {

    private static final Logger log = LoggerFactory.getLogger(Reactivator.class);
    private final ChangeMonitor changeMonitor;
    private final ChangePublisher changePublisher;
    private final StateStore stateStore;
    private final Consumer<StateStore> deprovisionHandler;
    private final ExecutorService executor;

    private Reactivator(Builder builder) {
        this.changeMonitor = builder.changeMonitor;
        this.changePublisher = builder.changePublisher;
        this.stateStore = builder.stateStore;
        this.deprovisionHandler = builder.deprovisionHandler;
        this.executor = Executors.newSingleThreadExecutor();
    }

    public void start() {
        executor.submit(() -> {
            try {
                log.info("Reactivator is starting.");
                changeMonitor.run(changePublisher, stateStore);
            } catch (Exception e) {
                try {
                    Files.write(Path.of("/dev/termination-log"), e.getMessage().getBytes());
                    log.error(e.getMessage());
                } catch (IOException ex) {
                    log.error(ex.getMessage());
                }
                System.exit(1);
            }
        });

        Undertow server = Undertow.builder()
                .addHttpListener(8080, "127.0.0.1")
                .setHandler(Handlers.path()
                        .addExactPath("/deprovision", Handlers.routing()
                                .post("", new HttpHandler() {
                                    @Override
                                    public void handleRequest(final HttpServerExchange exchange) throws Exception {
                                        try {
                                            if (deprovisionHandler != null) {
                                                deprovisionHandler.accept(stateStore);
                                            }
                                            exchange.setStatusCode(200);
                                        } catch (Exception e) {
                                            exchange.setStatusCode(500);
                                            exchange.getResponseSender().send("Deprovisioning failed");
                                        }
                                    }
                                })
                        ))
                .build();
        server.start();
    }

    public void close() throws Exception {
        changeMonitor.close();
        executor.shutdown();
        executor.awaitTermination(10, java.util.concurrent.TimeUnit.SECONDS);
    }

    public static Builder builder() {
        return new Builder();
    }

    public final static class Builder {

        private ChangeMonitor changeMonitor;
        private ChangePublisher changePublisher;
        private StateStore stateStore;
        private Consumer<StateStore> deprovisionHandler;

        private Builder() {
        }

        public Builder withChangeMonitor(ChangeMonitor changeMonitor) {
            this.changeMonitor = changeMonitor;
            return this;
        }

        public Builder withChangePublisher(ChangePublisher changePublisher) {
            this.changePublisher = changePublisher;
            return this;
        }

        public Builder withDeprovisionHandler(Consumer<StateStore> deprovisionHandler) {
            this.deprovisionHandler = deprovisionHandler;
            return this;
        }

        public Builder withStateStore(StateStore stateStore) {
            this.stateStore = stateStore;
            return this;
        }

        public Reactivator build() {
            if (changeMonitor == null) {
                throw new IllegalStateException("changeMonitor must be set");
            }

            if (changePublisher == null) {
                changePublisher = new DaprChangePublisher(System.getenv("SOURCE_ID"));
            }

            if (stateStore == null) {
                stateStore = new DaprStateStore();
            }

            return new Reactivator(this);
        }
    }

    public static String SourceId() {
        return System.getenv("SOURCE_ID");
    }

    public static String GetConfigValue(String key) {
        return System.getenv(key);
    }
}
