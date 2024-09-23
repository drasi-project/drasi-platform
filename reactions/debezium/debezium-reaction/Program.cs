using Dapr.Client;
using Confluent.Kafka;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var configuration = BuildConfiguration();

var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");

var brokers = configuration.GetValue<string>("Brokers");
var topic = configuration.GetValue<string>("Topic");
var includeSchemas = configuration.GetValue<bool>("IncludeSchemas", false);
var includeKey = configuration.GetValue<bool>("IncludeKey", false);

builder.Services.AddDaprClient();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseCloudEvents();

app.UseEndpoints(endpoints =>
{
    endpoints.MapSubscribeHandler();
    var ep = endpoints.MapPost("event", ProcessEvent);

    foreach (var qpath in Directory.GetFiles(configDirectory))
    {
        var queryId = Path.GetFileName(qpath);
        ep.WithTopic(pubsubName, queryId + "-results");
    }
});

app.Run("http://0.0.0.0:80");

async Task ProcessEvent(HttpContext context)
{
    try
    {
        var data = await JsonDocument.ParseAsync(context.Request.Body);

        Console.WriteLine("Got event: " + data.RootElement.GetRawText());

        var config = new ProducerConfig { BootstrapServers = brokers };
        using (var producer = new ProducerBuilder<Null, string>(config).Build())
        {
            var evt = data.RootElement;
            if (evt.GetProperty("kind").GetString() == "change")
            {
                // EventMetadata constructor enforces that properties must be non-null
                var metadata = new EventMetadata(evt);
                if (!File.Exists(Path.Combine(configDirectory, metadata.QueryId)))
                {
                    Console.WriteLine("Skipping " + metadata.QueryId);
                    context.Response.StatusCode = 200;
                    return;
                }
                Console.WriteLine("Processing " + metadata.QueryId);

                ProcessResults(producer, metadata, evt.GetProperty("addedResults"), "c");
                ProcessResults(producer, metadata, evt.GetProperty("updatedResults"), "u");
                ProcessResults(producer, metadata, evt.GetProperty("deletedResults"), "d");
 
                producer.Flush(TimeSpan.FromSeconds(10));
            }

            context.Response.StatusCode = 200;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error processing event: {ex.Message}");
        throw;
    }
}

static JsonObject GetKeySchema(EventMetadata metadata)
{
    var keySchema = new JsonObject();
    keySchema.Add("type", "struct");
    keySchema.Add("name", $"{metadata.Connector}.{metadata.Container}.{metadata.QueryId}.Key");
    keySchema.Add("optional", false);
    var fields = new JsonArray();
    fields.Add(new JsonObject
        {
            { "field", "id" },
            { "type", "string" },
            { "optional", false }
        });
    keySchema.Add("fields", fields);
    return keySchema;
}

static JsonObject GetKeyPayload(EventMetadata metadata)
{
    var keyPayload = new JsonObject();
    keyPayload.Add("id", metadata.Seq.ToString());
    return keyPayload;
}

static JsonArray GetChangeDataFields(JsonElement changeData)
{
    var changeDataFields = new JsonArray();
    foreach (var prop in changeData.EnumerateObject())
    {
        changeDataFields.Add(new JsonObject
        {
            { "field", prop.Name },
            { "type", prop.Value.ValueKind.ToString().ToLower() },
            { "optional", false }
        });
    }
    return changeDataFields;
}

static JsonObject GetValueSchema(EventMetadata metadata, JsonElement res)
{
    JsonElement changeData;
    if (!res.TryGetProperty("before", out changeData))
    {
        if (!res.TryGetProperty("after", out changeData))
        {
            throw new Exception("Neither before nor after values found in res");
        }
    }
    var changeDataFields = GetChangeDataFields(changeData);
    var changeDataFields2 = GetChangeDataFields(changeData);

    var sourceFields = new JsonArray();
    sourceFields.Add(new JsonObject
        {
            { "field", "version" },
            { "type", "string" },
            { "optional", false }
        });
    sourceFields.Add(new JsonObject
        {
            { "field", "connector" },
            { "type", "string" },
            { "optional", false }
        });
    sourceFields.Add(new JsonObject
        {
            { "field", "container" },
            { "type", "string" },
            { "optional", false }
        });
    sourceFields.Add(new JsonObject
        {
            { "field", "hostname" },
            { "type", "string" },
            { "optional", false }
        });
    sourceFields.Add(new JsonObject
        {
            { "field", "ts_ms" },
            { "type", "int64" },
            { "optional", false }
        });
    sourceFields.Add(new JsonObject
        {
            { "field", "seq" },
            { "type", "int64" },
            { "optional", false }
        });

    var valueFields = new JsonArray();
    valueFields.Add(new JsonObject
        {
            { "type", "struct" },
            { "fields", changeDataFields },
            { "optional", true},
            { "name", $"{metadata.Connector}.{metadata.Container}.{metadata.QueryId}.Value" },
            { "field", "before" }
        });
    valueFields.Add(new JsonObject
        {
            { "type", "struct" },
            { "fields", changeDataFields2 },
            { "optional", true},
            { "name", $"{metadata.Connector}.{metadata.Container}.{metadata.QueryId}.Value" },
            { "field", "after" }
        });
    valueFields.Add(new JsonObject
        {
            { "type", "struct" },
            { "fields", sourceFields },
            { "optional", false},
            { "name", $"io.debezium.connector.{metadata.Connector}.Source" },
            { "field", "source" }
        });
    valueFields.Add(new JsonObject
        {
            { "type", "string" },
            { "optional", false},
            { "field", "op" }
        });
    valueFields.Add(new JsonObject
        {
            { "type", "int64" },
            { "optional", true},
            { "field", "ts_ms" }
        });

    var valueSchema = new JsonObject();
    valueSchema.Add("type", "struct");
    valueSchema.Add("fields", valueFields);
    valueSchema.Add("optional", false);
    valueSchema.Add("name", $"{metadata.Connector}.{metadata.Container}.{metadata.QueryId}.Envelope");

    return valueSchema;
}

static JsonObject GetValuePayload(string op, EventMetadata metadata, JsonElement res)
{
    JsonObject valueSource = new JsonObject();
    valueSource.Add("version", metadata.Version);
    valueSource.Add("connector", metadata.Connector);
    valueSource.Add("container", metadata.Container);
    valueSource.Add("hostname", metadata.Hostname);
    valueSource.Add("ts_ms", metadata.TsMs);
    valueSource.Add("seq", metadata.Seq);

    JsonObject? beforeValue = null;
    JsonObject? afterValue = null;
    switch (op)
    {
        case "c":
            afterValue = JsonObject.Create(res);
            break;
        case "u":
            beforeValue = JsonObject.Create(res.GetProperty("before"));
            afterValue = JsonObject.Create(res.GetProperty("after"));
            break;
        case "d":
            beforeValue = JsonObject.Create(res);
            break;
        default:
            throw new Exception("Unknown op: " + op);
    }

    JsonObject valuePayload = new JsonObject();
    valuePayload.Add("before", beforeValue);
    valuePayload.Add("after", afterValue);
    valuePayload.Add("source", valueSource);
    valuePayload.Add("op", op);
    valuePayload.Add("ts_ms", System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());

    return valuePayload;
}

void ProcessResults(IProducer<Null, string> producer, EventMetadata metadata, JsonElement results, string op)
{
    Console.WriteLine($"Processing {results.GetArrayLength()} {op} Results...");
    var noIndent = new JsonSerializerOptions { WriteIndented = false };
    foreach (var res in results.EnumerateArray())
    {
        Console.WriteLine($"Op:{op} Result {res}");

        // Debezium data change event format has duplicate property names, so we need to serialize manually
        var dataChangeEvent = new StringBuilder("{");
        if (includeKey)
        {
            if (includeSchemas) {
                var keySchema = GetKeySchema(metadata);
                var keySchemaString = JsonSerializer.Serialize(keySchema, noIndent);
                dataChangeEvent.Append($"\"schema\":{keySchemaString},");
            }

            var keyPayload = GetKeyPayload(metadata);
            var keyPayloadString = JsonSerializer.Serialize(keyPayload, noIndent);
            dataChangeEvent.Append($"\"payload\":{keyPayloadString},");
        }

        var valuePayload = GetValuePayload(op, metadata, res);
        var valuePayloadString = JsonSerializer.Serialize(valuePayload, noIndent);

        if (includeSchemas)
        {
            var valueSchema = GetValueSchema(metadata, res);
            var valueSchemaString = JsonSerializer.Serialize(valueSchema, noIndent);
            dataChangeEvent.Append($"\"schema\":{valueSchemaString},");
        }
        dataChangeEvent.Append($"\"payload\":{valuePayloadString}");
        dataChangeEvent.Append("}");

        var eventString = dataChangeEvent.ToString();
        Console.WriteLine("dataChangeEvent:" + eventString);
        producer.Produce(topic, new Message<Null, string> { Value = eventString });
    }
}

static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        .AddEnvironmentVariables()
        .Build();
}

class EventMetadata {
    public string Connector { get; }
    public string Container { get; }
    public string Hostname { get; }
    public string QueryId { get; }
    public long Seq { get; }
    public long TsMs { get; }
    public string Version { get; }

    public EventMetadata(JsonElement evt)
    {
        var queryId = evt.GetProperty("queryId").GetString();
        var tracking = evt.GetProperty("metadata").GetProperty("tracking");

        var query = tracking.GetProperty("query");
        var container = query.GetProperty("container").GetString();
        var hostname = query.GetProperty("hostName").GetString();
        var ts_ms = query.GetProperty("queryEnd_ms").GetInt64();

        var source = tracking.GetProperty("source");
        var seq = source.GetProperty("seq").GetInt64();

        Connector = "drasi";
        Container = container ?? throw new Exception("Container is null");
        Hostname = hostname ?? throw new Exception("Hostname is null");
        QueryId = queryId ?? throw new Exception("QueryId is null");
        Seq = seq;
        TsMs = ts_ms;
        Version = "preview.1";
    }
}
