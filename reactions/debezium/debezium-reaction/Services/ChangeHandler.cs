// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

namespace Drasi.Reactions.Debezium.Services;

using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reaction.SDK;
using Confluent.Kafka;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Text;
using System.Text.Json.Nodes;

class DebeziumChangeHandler : IChangeEventHandler
{
	private readonly ILogger<DebeziumChangeHandler> _logger;
	private readonly DebeziumService _debeziumService;

	private readonly IProducer<Null, string> _producer;

	public DebeziumChangeHandler(ILogger<DebeziumChangeHandler> logger, DebeziumService debeziumService)
	{
		_logger = logger;
		_debeziumService = debeziumService;
		_producer = new ProducerBuilder<Null, string>(_debeziumService.Config).Build();
	}

	public async Task HandleChange(ChangeEvent evt, object? queryConfig)
	{
		var metadata = new EventMetadata(evt);

		_logger.LogInformation("Processing {QueryId}", metadata.QueryId);

		await ProcessResults(metadata, evt.AddedResults, "c");

		var updatedResults = new List<Dictionary<string, object>>();
		for (int i = 0; i < evt.UpdatedResults.Length; i++)
		{
			var currResultDict = new Dictionary<string, object>
			{
				["before"] = evt.UpdatedResults[i].Before,
				["after"] = evt.UpdatedResults[i].After
			};
			updatedResults.Add(currResultDict);
		}
		await ProcessResults(metadata, [.. updatedResults], "u");
		await ProcessResults(metadata, evt.DeletedResults, "d");

		_producer.Flush();
	}

	private async Task ProcessResults(EventMetadata metadata, Dictionary<string, object>[] results, string op)
	{
		var noIndent = new JsonSerializerOptions { WriteIndented = false };
		foreach (var res in results)
		{
			// Debezium data change event format has duplicate property names, so we need to serialize manually
			var dataChangeEvent = new StringBuilder("{");
			if (_debeziumService.IncludeKey)
			{
				if (_debeziumService.IncludeSchemas)
				{
					var keySchema = GetKeySchema(metadata);
					var keySchemaString = JsonSerializer.Serialize(keySchema, noIndent);
					dataChangeEvent.Append($"\"schema\":{keySchemaString},");
				}

				var keyPayload = GetKeyPayload(metadata);
				var keyPayloadString = JsonSerializer.Serialize(keyPayload, noIndent);
				dataChangeEvent.Append($"\"payload\":{keyPayloadString},");
			}

			var resultJsonElement = ConvertDictionaryToJsonElement(res);
			var valuePayload = GetValuePayload(op, metadata, resultJsonElement);
			var valuePayloadString = JsonSerializer.Serialize(valuePayload, noIndent);

			if (_debeziumService.IncludeSchemas)
			{
				var valueSchema = GetValueSchema(metadata, resultJsonElement);
				var valueSchemaString = JsonSerializer.Serialize(valueSchema, noIndent);
				dataChangeEvent.Append($"\"schema\":{valueSchemaString},");
			}
			dataChangeEvent.Append($"\"payload\":{valuePayloadString}");
			_ = dataChangeEvent.Append("}");

			var eventString = dataChangeEvent.ToString();
			_logger.LogInformation($"dataChangeEvent: {eventString}");
			try
			{
				var deliveryReport = await _producer.ProduceAsync(_debeziumService.Topic, new Message<Null, string> { Value = eventString }, CancellationToken.None);

				if (deliveryReport.Status != PersistenceStatus.Persisted)
				{
					_logger.LogInformation($"Delivery failed: {deliveryReport.Message.Value}");
				}
				else
				{
					_logger.LogInformation($"Message delivered to {deliveryReport.TopicPartitionOffset}");
				}
			
			}
			catch (ProduceException<Null, string> ex)
			{
				_logger.LogInformation($"ProduceException: {ex.Error.Reason}");
			}
		}
	}

	static JsonObject GetKeyPayload(EventMetadata metadata)
	{
		var keyPayload = new JsonObject
		{
			{ "id", metadata.Seq.ToString() }
		};
		return keyPayload;
	}

	static JsonObject GetKeySchema(EventMetadata metadata)
	{
		var keySchema = new JsonObject
		{
			{ "type", "struct" },
			{ "name", $"{metadata.Connector}.{metadata.QueryId}.Key" },
			{ "optional", false }
		};
		var fields = new JsonArray
		{
			new JsonObject
			{
				{ "field", "id" },
				{ "type", "string" },
				{ "optional", false }
			}
		};
		keySchema.Add("fields", fields);
		return keySchema;
	}
	
	static JsonElement ConvertDictionaryToJsonElement(Dictionary<string, object> dictionary)
    {
        string jsonString = JsonSerializer.Serialize(dictionary);

        using JsonDocument jsonDocument = JsonDocument.Parse(jsonString);

        return jsonDocument.RootElement.Clone();
    }

	static JsonObject GetValuePayload(string op, EventMetadata metadata, JsonElement res)
	{
		JsonObject valueSource = new()
		{
			{ "version", metadata.Version },
			{ "connector", metadata.Connector },
			{ "ts_ms", metadata.TsMs },
			{ "seq", metadata.Seq }
		};

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

		JsonObject valuePayload = new()
		{
			{ "before", beforeValue },
			{ "after", afterValue },
			{ "source", valueSource },
			{ "op", op },
			{ "ts_ms", System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() }
		};

		return valuePayload;
	}

	static JsonObject GetValueSchema(EventMetadata metadata, JsonElement res)
	{
		var changeDataFields = GetChangeDataFields(res);
		var changeDataFields2 = GetChangeDataFields(res);

		var sourceFields = new JsonArray
		{
			new JsonObject
			{
				{ "field", "version" },
				{ "type", "string" },
				{ "optional", false }
			},
			new JsonObject
			{
				{ "field", "connector" },
				{ "type", "string" },
				{ "optional", false }
			},
			new JsonObject
			{
				{ "field", "container" },
				{ "type", "string" },
				{ "optional", false }
			},
			new JsonObject
			{
				{ "field", "hostname" },
				{ "type", "string" },
				{ "optional", false }
			},
			new JsonObject
			{
				{ "field", "ts_ms" },
				{ "type", "int64" },
				{ "optional", false }
			},
			new JsonObject
			{
				{ "field", "seq" },
				{ "type", "int64" },
				{ "optional", false }
			}
		};

		var valueFields = new JsonArray
		{
			new JsonObject
			{
				{ "type", "struct" },
				{ "fields", changeDataFields },
				{ "optional", true},
				{ "name", $"{metadata.Connector}.{metadata.QueryId}.Value" },
				{ "field", "before" }
			},
			new JsonObject
			{
				{ "type", "struct" },
				{ "fields", changeDataFields2 },
				{ "optional", true},
				{ "name", $"{metadata.Connector}.{metadata.QueryId}.Value" },
				{ "field", "after" }
			},
			new JsonObject
			{
				{ "type", "struct" },
				{ "fields", sourceFields },
				{ "optional", false},
				{ "name", $"io.debezium.connector.{metadata.Connector}.Source" },
				{ "field", "source" }
			},
			new JsonObject
			{
				{ "type", "string" },
				{ "optional", false},
				{ "field", "op" }
			},
			new JsonObject
			{
				{ "type", "int64" },
				{ "optional", true},
				{ "field", "ts_ms" }
			}
		};

		var valueSchema = new JsonObject
		{
			{ "type", "struct" },
			{ "fields", valueFields },
			{ "optional", false },
			{ "name", $"{metadata.Connector}.{metadata.QueryId}.Envelope" }
		};

		return valueSchema;
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
}
