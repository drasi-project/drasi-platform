package io.drasi.source.sdk;

import io.drasi.source.sdk.models.BootstrapRequest;
import io.drasi.source.sdk.models.SourceElement;
import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.HttpHandler;
import io.undertow.server.HttpServerExchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.function.Function;

public class SourceProxy {

    private static final Logger log = LoggerFactory.getLogger(SourceProxy.class);
    private final Function<BootstrapRequest, BootstrapStream> streamFunction;
    private final int port;

    private SourceProxy(Builder builder) {
        this.streamFunction = builder.streamFunction;
        this.port = builder.port;
    }

    public void start() {
        Undertow server = Undertow.builder()
                .addHttpListener(port, "0.0.0.0")
                .setHandler(Handlers.routing()
                        .post("acquire-stream", new JsonStreamingHandler(streamFunction))
                        .get("supports-stream", new HttpHandler() {
                            @Override
                            public void handleRequest(HttpServerExchange exchange) throws Exception {
                                exchange.setStatusCode(204);
                            }
                        })
                        .post("supports-stream", new HttpHandler() {
                            @Override
                            public void handleRequest(HttpServerExchange exchange) throws Exception {
                                exchange.setStatusCode(204);
                            }
                        })
                )
                .build();
        server.start();
    }

    public static SourceProxy.Builder builder() {
        return new SourceProxy.Builder();
    }

    public static class Builder {
        private Function<BootstrapRequest, BootstrapStream> streamFunction;
        private int port = 80;

        public Builder withStreamFunction(Function<BootstrapRequest, BootstrapStream> streamFunction) {
            this.streamFunction = streamFunction;
            return this;
        }

        public Builder withPort(int port) {
            this.port = port;
            return this;
        }

        public SourceProxy build() {
            if (streamFunction == null) {
                throw new IllegalArgumentException("streamFunction is required");
            }

            return new SourceProxy(this);
        }
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
}
