using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Drasi.Source.SDK.Models;

public class SourceElement
{
    private readonly string id;
    private readonly JsonObject? properties;
    private readonly HashSet<string> labels;
    private readonly string? startId;
    private readonly string? endId;

    public ElementType Type { get; private set; }

    /// <summary>
    /// Create a new SourceElement that represents a node
    /// </summary>
    /// <param name="id">Unique ID of the node within the context of the entire source</param>
    /// <param name="labels">Labels for the node in the property graph</param>
    /// <param name="properties">Properties of the node</param>
    public SourceElement(string id, HashSet<string> labels, JsonObject? properties)
    {
        this.id = id;
        this.properties = properties;
        this.labels = labels;
        this.Type = ElementType.Node;
    }

    /// <summary>
    /// Create a new SourceElement that represents a relation
    /// </summary>
    /// <param name="id">Unique ID of the relation within the context of the entire source</param>
    /// <param name="labels">Labels for the relation in the property graph</param>
    /// <param name="properties">Properties of the relation</param>
    /// <param name="startId">ID of the inbound node for this relationship</param>
    /// <param name="endId">ID of the outbound  node for this relationship</param>
    public SourceElement(string id, HashSet<string> labels, JsonObject? properties, string startId, string endId)
    {
        this.id = id;
        this.properties = properties;
        this.labels = labels;
        this.startId = startId;
        this.endId = endId;
        this.Type = ElementType.Relation;
    }

    public string ToJson()
    {
        var result = ToJsonObject();
        return result.ToJsonString();
    }

    public JsonObject ToJsonObject()
    {
        var result = new JsonObject
        {
            { "id", id }
        };

        var lbls = new JsonArray();
        foreach (var lbl in labels)
        {
            lbls.Add(lbl);
        }
        result.Add("labels", lbls);

        if (properties != null)
        {
            result.Add("properties", properties);
        }

        if (startId != null)
        {
            result.Add("startId", startId);
        }

        if (endId != null)
        {
            result.Add("endId", endId);
        }

        return result;
    }

    public enum ElementType
    {
        Node,
        Relation
    }
}