package io.drasi.source.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.drasi.source.sdk.models.BootstrapRequest;
import io.undertow.server.HttpHandler;
import io.undertow.server.HttpServerExchange;
import io.undertow.util.Headers;
import io.undertow.io.IoCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.function.Function;

public class JsonStreamingHandler implements HttpHandler {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final Logger log = LoggerFactory.getLogger(JsonStreamingHandler.class);
    private final Function<BootstrapRequest, BootstrapStream> streamFunction;

    public JsonStreamingHandler(Function<BootstrapRequest, BootstrapStream> streamFunction) {
        this.streamFunction = streamFunction;
    }

    @Override
    public void handleRequest(HttpServerExchange exchange) {
        exchange.getRequestReceiver().receiveFullBytes((httpServerExchange, message) -> {
            BootstrapRequest req;
            try {
                req = objectMapper.readValue(message, BootstrapRequest.class);
            } catch (Exception e) {
                log.error("Error parsing request", e);
                httpServerExchange.setStatusCode(400);
                httpServerExchange.getResponseSender().send("Error parsing request: " + e.getMessage());
                httpServerExchange.endExchange();
                return;
            }
            var stream = streamFunction.apply(req);
            var errors = stream.validate();
            if (!errors.isEmpty()) {
                var msg = String.join(", ", errors);
                httpServerExchange.setStatusCode(400);
                httpServerExchange.getResponseSender().send("Error validating request: " + msg);
                httpServerExchange.endExchange();
                return;
            }

            exchange.getResponseHeaders().put(Headers.CONTENT_TYPE, "application/json");
            exchange.getResponseHeaders().remove(Headers.CONTENT_LENGTH);

            exchange.getResponseSender().send("", new IoCallback() {
                @Override
                public void onComplete(HttpServerExchange exchange, io.undertow.io.Sender sender) {
                    streamJsonArray(exchange, stream);
                }

                @Override
                public void onException(HttpServerExchange exchange, io.undertow.io.Sender sender, IOException exception) {
                    log.error("Error sending response", exception);
                    exchange.setStatusCode(500);
                    exchange.endExchange();
                    try {
                        stream.close();
                    } catch (Exception e) {
                        log.error("Error closing stream", e);
                    }
                }
            });
        });
    }

    private void streamJsonArray(HttpServerExchange exchange, BootstrapStream stream) {
        var next = stream.next();
        if (next == null) {
            exchange.endExchange();
            try {
                stream.close();
            } catch (Exception e) {
                log.error("Error closing stream", e);
            }
            return;
        }

        String chunk = next.toJson();
        chunk += "\n";

        exchange.getResponseSender().send(chunk, new IoCallback() {
            @Override
            public void onComplete(HttpServerExchange exchange, io.undertow.io.Sender sender) {
                streamJsonArray(exchange, stream);
            }

            @Override
            public void onException(HttpServerExchange exchange, io.undertow.io.Sender sender, IOException exception) {
                log.error("Error sending response", exception);
                exchange.setStatusCode(500);
                exchange.endExchange();
                try {
                    stream.close();
                } catch (Exception e) {
                    log.error("Error closing stream", e);
                }
            }
        });
    }
}
