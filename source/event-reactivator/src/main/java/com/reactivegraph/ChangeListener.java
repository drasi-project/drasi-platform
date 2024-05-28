package com.reactivegraph;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.tinkerpop.gremlin.process.traversal.step.util.event.MutationListener;
import org.apache.tinkerpop.gremlin.structure.Edge;
import org.apache.tinkerpop.gremlin.structure.Property;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.apache.tinkerpop.gremlin.structure.VertexProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class ChangeListener implements MutationListener {

    private Map<Object, ObjectNode> changes = new HashMap<>();

    public Collection<ObjectNode> getChanges() {
        return changes.values();
    }

    private ObjectNode buildWrapper(JsonNode before, JsonNode after, String table, String op) {
        var time = System.currentTimeMillis();
        var rgSource = JsonNodeFactory.instance.objectNode();
        rgSource.put("db", "test");
        rgSource.put("table", table);
        rgSource.put("lsn", 0);
        rgSource.put("ts_ms", time);
        rgSource.put("ts_sec", time / 1000);

        var rgPayload = JsonNodeFactory.instance.objectNode();
        rgPayload.set("source", rgSource);
        rgPayload.set("before", before);
        rgPayload.set("after", after);

        var rgChange = JsonNodeFactory.instance.objectNode();
        rgChange.put("op", op);
        rgChange.put("ts_ms", time);
        rgChange.set("payload", rgPayload);

        return rgChange;
    }

    private ObjectNode buildVertex(Vertex vertex) {
        var result = JsonNodeFactory.instance.objectNode();
        result.put("id", vertex.id().toString());

        var labels = JsonNodeFactory.instance.arrayNode();
        labels.add(vertex.label());
        result.set("labels", labels);

        var properties = JsonNodeFactory.instance.objectNode();

        var fields = vertex.properties();
        while (fields.hasNext()) {
            var field = fields.next();
            properties.put(field.key(), field.value().toString());
        }
        result.set("properties", properties);

        return result;
    }

    private ObjectNode buildEdge(Edge edge) {
        var result = JsonNodeFactory.instance.objectNode();
        result.put("id", edge.id().toString());

        var labels = JsonNodeFactory.instance.arrayNode();
        labels.add(edge.label());
        result.set("labels", labels);

        var properties = JsonNodeFactory.instance.objectNode();

        var fields = edge.properties();
        while (fields.hasNext()) {
            var field = fields.next();
            properties.put(field.key(), field.value().toString());
        }
        result.set("properties", properties);
        result.put("startId", edge.inVertex().id().toString());
        result.put("endId", edge.outVertex().id().toString());

        return result;
    }

    private ObjectNode getVertexPayload(Vertex vertex) {
        if (changes.containsKey(vertex.id())) {
            return (ObjectNode) (changes.get(vertex.id()).get("payload"));
        }

        var after = buildVertex(vertex);
        var before = buildVertex(vertex);

        changes.put(vertex.id(), buildWrapper(before, after, "node", "u"));
        return (ObjectNode) (changes.get(vertex.id()).get("payload"));
    }

    @Override
    public void vertexAdded(Vertex vertex) {
        var before = JsonNodeFactory.instance.objectNode();
        var after = buildVertex(vertex);

        changes.put(vertex.id(), buildWrapper(before, after, "node", "i"));
    }

    @Override
    public void vertexRemoved(Vertex vertex) {
        var after = JsonNodeFactory.instance.objectNode();
        var before = buildVertex(vertex);

        changes.put(vertex.id(), buildWrapper(before, after, "node", "d"));
    }

    @Override
    public void vertexPropertyChanged(Vertex element, VertexProperty oldValue, Object setValue, Object... vertexPropertyKeyValues) {
        if (oldValue.isPresent() && oldValue.value() == setValue)
            return;
        var payload = getVertexPayload(element);
        var afterProps = (ObjectNode)(payload.get("after").get("properties"));
        afterProps.put(oldValue.key(), setValue.toString());

        if (oldValue.isPresent()) {
            var beforeProps = (ObjectNode) (payload.get("before").get("properties"));
            beforeProps.put(oldValue.key(), oldValue.value().toString());
        }
    }

    @Override
    public void vertexPropertyRemoved(VertexProperty vertexProperty) {

    }

    @Override
    public void edgeAdded(Edge edge) {
        var before = JsonNodeFactory.instance.objectNode();
        var after = buildEdge(edge);

        changes.put(edge.id(), buildWrapper(before, after, "rel", "i"));
    }

    @Override
    public void edgeRemoved(Edge edge) {
        var after = JsonNodeFactory.instance.objectNode();
        var before = buildEdge(edge);

        changes.put(edge.id(), buildWrapper(before, after, "rel", "d"));
    }

    @Override
    public void edgePropertyChanged(Edge element, Property oldValue, Object setValue) {

    }

    @Override
    public void edgePropertyRemoved(Edge element, Property property) {

    }

    @Override
    public void vertexPropertyPropertyChanged(VertexProperty element, Property oldValue, Object setValue) {
        //System.out.println();
    }

    @Override
    public void vertexPropertyPropertyRemoved(VertexProperty element, Property property) {

    }
}
