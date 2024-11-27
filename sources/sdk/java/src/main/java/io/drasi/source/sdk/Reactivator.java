/*
 * Copyright 2024 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    private final int port;

    private Reactivator(Builder builder) {
        this.changeMonitor = builder.changeMonitor;
        this.changePublisher = builder.changePublisher;
        this.stateStore = builder.stateStore;
        this.deprovisionHandler = builder.deprovisionHandler;
        this.port = builder.port;
        this.executor = Executors.newSingleThreadExecutor();
    }

    /**
     * Starts the reactivator.
     */
    public void start() {
        executor.submit(() -> {
            try {
                log.info("Reactivator is starting.");
                changeMonitor.run(changePublisher, stateStore);
            } catch (Exception e) {
                TerminalError(e);
            }
        });

        Undertow server = Undertow.builder()
                .addHttpListener(port, "127.0.0.1")
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

    /**
     * Gets the source id.
     *
     * @return The source id.
     */
    public static String SourceId() {
        return System.getenv("SOURCE_ID");
    }

    /**
     * Gets a configuration value for the source
     *
     * @param key The key to get the value for.
     * @return The value for the key.
     */
    public static String GetConfigValue(String key) {
        return System.getenv(key);
    }

    /**
     * Gets a configuration value for the source
     *
     * @param key          The key to get the value for.
     * @param defaultValue The default value to return if the key is not found.
     * @return The value for the key.
     */
    public static String GetConfigValue(String key, String defaultValue) {
        var result = System.getenv(key);
        return result != null ? result : defaultValue;
    }

    /**
     * Logs an error and exits the application.
     *
     * @param e The exception to log.
     */
    public static void TerminalError(Throwable e) {
        try {
            var messageBuilder = new StringBuilder();
            var c = e;
            while (c != null) {
                messageBuilder.append(c.getMessage() + "\n");
                c = c.getCause();
            }
            var message = messageBuilder.toString();
            log.error(message);
            Files.write(Path.of("/dev/termination-log"), message.getBytes());
        } catch (IOException ex) {
            log.error(ex.getMessage());
        }
        System.exit(1);
    }

    public static Builder builder() {
        return new Builder();
    }

    public final static class Builder {

        private ChangeMonitor changeMonitor;
        private ChangePublisher changePublisher;
        private StateStore stateStore;
        private Consumer<StateStore> deprovisionHandler;
        private int port = 80;

        private Builder() {
        }

        /**
         * Sets the change monitor, which will listen for changes coming form the data source and publish them to the queries.
         *
         * @param changeMonitor The change monitor.
         * @return The builder.
         */
        public Builder withChangeMonitor(ChangeMonitor changeMonitor) {
            this.changeMonitor = changeMonitor;
            return this;
        }

        /**
         * Overrides the default change publisher, which will publish changes to the queries.
         *
         * @param changePublisher The change publisher.
         * @return The builder.
         */
        public Builder withChangePublisher(ChangePublisher changePublisher) {
            this.changePublisher = changePublisher;
            return this;
        }

        /**
         * Sets the deprovision handler, which will be called when the reactivator is deprovisioned.
         *
         * @param deprovisionHandler The deprovision handler.
         * @return The builder.
         */
        public Builder withDeprovisionHandler(Consumer<StateStore> deprovisionHandler) {
            this.deprovisionHandler = deprovisionHandler;
            return this;
        }

        /**
         * Overrides the default state store.
         *
         * @param stateStore The state store.
         * @return The builder.
         */
        public Builder withStateStore(StateStore stateStore) {
            this.stateStore = stateStore;
            return this;
        }

        public Builder withPort(int port) {
            this.port = port;
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


}
