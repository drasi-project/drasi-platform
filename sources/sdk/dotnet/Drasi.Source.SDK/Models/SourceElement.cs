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

    public SourceElement(string id, HashSet<string> labels, JsonObject? properties)
    {
        this.id = id;
        this.properties = properties;
        this.labels = labels;
        this.Type = ElementType.Node;
    }

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
        return result.ToString();
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
            result.Add("start_id", startId);
        }

        if (endId != null)
        {
            result.Add("end_id", endId);
        }

        return result;
    }

    public enum ElementType
    {
        Node,
        Relation
    }
}