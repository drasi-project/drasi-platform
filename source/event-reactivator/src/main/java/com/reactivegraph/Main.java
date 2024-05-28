package com.reactivegraph;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.tinkerpop.gremlin.java.GremlinPipeline;
import org.apache.commons.configuration2.BaseConfiguration;
import org.apache.commons.configuration2.Configuration;
import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversalSource;
import org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.EventStrategy;
import org.apache.tinkerpop.gremlin.structure.Graph;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.apache.tinkerpop.gremlin.tinkergraph.structure.TinkerGraph;
import org.opencypher.gremlin.client.CypherGremlinClient;

import java.io.File;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.azure.core.util.*;
import com.azure.storage.queue.*;
import com.azure.storage.queue.models.*;
import reactor.core.publisher.Mono;
import reactor.netty.http.server.HttpServer;

import static java.lang.Thread.sleep;
import static org.apache.tinkerpop.gremlin.process.traversal.AnonymousTraversalSource.traversal;

import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;
import static io.netty.handler.codec.http.HttpHeaderValues.APPLICATION_JSON;

public class Main {

    public static void main(String[] args) throws Exception {

        var connectStr = System.getenv("QueueConnection");
        var queueName = System.getenv("QueueName");
        var mappings = System.getenv("Mapping");
        var sourceId = System.getenv("SOURCE_ID");
        var pubsubName = System.getenv("PUBSUB");
        if (pubsubName == null)
            pubsubName = "rg-pubsub";

        Configuration cfg = new BaseConfiguration();
        //cfg.setProperty("gremlin.tinkergraph.graphLocation", "/data/graph");
        //cfg.setProperty("gremlin.tinkergraph.graphFormat", "graphson");

        var publisher = new DaprChangePublisher(sourceId, pubsubName);
        Graph graph = TinkerGraph.open(cfg);

        var server = HttpServer.create()
                .port(80)
                .route(routes -> {
                    routes.post("/acquire", (request, response) -> {
                        System.out.println("/acquire");

                        return response
                                .header(CONTENT_TYPE, APPLICATION_JSON)
                                .sendString(Mono.just("{ \"nodes\": [], \"rels\": [] }"));
                    });
                })
                .bindNow();
        System.out.println("listening...");

        ObjectMapper om = new ObjectMapper(new YAMLFactory());

        var mapping = om.readValue(mappings, EventMapping.class);
        ObjectMapper objectMapper = new ObjectMapper();

        QueueClient queueClient = new QueueClientBuilder()
                .connectionString(connectStr)
                .queueName(queueName)
                .buildClient();

        QueueMessageItem message = null;
        while (message == null) {
            message = queueClient.receiveMessage();
            if (message == null) {
                sleep(500);
                continue;
            }
            var evt = objectMapper.readTree(message.getMessageText());
            for (var m : mapping.getMutations()) {
                if (!evt.has(m.getKey()))
                    continue;

                var val = evt.get(m.getKey()).asText();

                if (!val.equals(m.getValue()))
                    continue;

                var changeCollector = new ChangeListener();
                var evtStrategy = EventStrategy.build().addListener(changeCollector).create();
                GraphTraversalSource g = traversal()
                        .withEmbedded(graph)
                        .withStrategies(evtStrategy);

                CypherGremlinClient cypherGremlinClient = CypherGremlinClient.inMemory(g);
                var params = extractEvent(evt);

                cypherGremlinClient.submit(m.getMutation(), params).all();

                var changes = changeCollector.getChanges();

                publisher.Publish(changes);

            }

            queueClient.deleteMessage(message.getMessageId(), message.getPopReceipt());
            message = null;
        }
        graph.close();

    }

    static Map<String, ?> extractEvent(JsonNode jsonNode) {
        var result = new HashMap<String, Object>();
        var iter = jsonNode.fields();
        while (iter.hasNext()) {
            var item = iter.next();
            result.put(item.getKey(), item.getValue().toString());
        }

        return result;
    }
}