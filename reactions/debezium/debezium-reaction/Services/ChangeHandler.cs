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

using Microsoft.Extensions.Configuration;
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

	private readonly IProducer<Null, string> _producer;

	private readonly bool _includeSchemas;
	private readonly bool _includeKey;

	private readonly string _topic;

	public DebeziumChangeHandler(IConfiguration config, ILogger<DebeziumChangeHandler> logger)
	{
		_logger = logger;
		_topic = config.GetValue<string>("topic") ?? throw new ArgumentNullException("Debezium topic is required");
		_includeSchemas = config.GetValue<bool?>("includeSchemas") ?? true;
		_includeKey = config.GetValue<bool?>("includeKey") ?? true;	
		
		// A list of brokers; represented as a comma-separated string
		string brokers = config.GetValue<string>("brokers") ?? throw new ArgumentNullException("Debezium brokers is required");

		ProducerConfig producerConfig = new ProducerConfig
		{
			BootstrapServers = brokers
		};

		_producer = new ProducerBuilder<Null, string>(producerConfig).Build();
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
			var dataChangeEventKey = new DataChangeEventKey();
			var dataChangeEventValue = new DataChangeEventValue();
			if (_includeKey)
			{
				if (_includeSchemas)
				{
					var keySchema = GetKeySchema(metadata);
					dataChangeEventKey.KeySchema = keySchema;
				}

				var keyPayload = GetKeyPayload(metadata);
				dataChangeEventKey.KeyPayload = keyPayload;
				var keyString = JsonSerializer.Serialize(dataChangeEventKey, noIndent);
			}

			var resultJsonElement = ConvertDictionaryToJsonElement(res);
			var valuePayload = GetValuePayload(op, metadata, resultJsonElement);

			if (_includeSchemas)
			{
				var valueSchema = GetValueSchema(metadata, resultJsonElement);
				dataChangeEventValue.ValueSchema = valueSchema;
			}
			dataChangeEventValue.ValuePayload = valuePayload;
			var eventString = JsonSerializer.Serialize(dataChangeEventValue, noIndent);
			if (_includeKey)
			{
				// We are unable to serialize the key and the value together, as we have duplicate key names
				// This will result in the error: `System.InvalidOperationException: The JSON property name for 'Drasi.Reactions.Debezium.Services.DataChangeEvent.schema' collides with another property`
				// serialize the key, and then concatenate the value
				var eventKeyString = JsonSerializer.Serialize(dataChangeEventKey, noIndent);
				if (eventKeyString.Length > 0 && eventKeyString.EndsWith("}"))
				{
					eventKeyString = eventKeyString.Substring(0, eventKeyString.Length - 1); // Remove the last '}'
				}
				eventString = eventString.TrimStart('{');

				eventString = eventKeyString + "," + eventString;
			}
			_logger.LogInformation($"dataChangeEvent: {eventString}");

			try
			{
				var deliveryReport = await _producer.ProduceAsync(_topic, new Message<Null, string> { Value = eventString }, CancellationToken.None);

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

	static KeyPayload GetKeyPayload(EventMetadata metadata)
	{
		var keyPayload = new KeyPayload
		{
			Id = metadata.Seq.ToString()
		};
		return keyPayload;
	}

	static Schema GetKeySchema(EventMetadata metadata)
	{
		var keySchema = new Schema
		{
			Type = "struct",
			Name = $"{metadata.Connector}.{metadata.QueryId}.Key",
			Optional = false,
			Fields = new List<Field>
			{
				new Field
				{
					SchemaField = "id",
					Type = "string",
					Optional = false
				}
			}
		};
		return keySchema;
	}
	
	static JsonElement ConvertDictionaryToJsonElement(Dictionary<string, object> dictionary)
    {
        string jsonString = JsonSerializer.Serialize(dictionary);

        using JsonDocument jsonDocument = JsonDocument.Parse(jsonString);

        return jsonDocument.RootElement.Clone();
    }

	static Payload GetValuePayload(string op, EventMetadata metadata, JsonElement res)
	{
		var valuePayload = new Payload
		{
			Source = new Source
			{
				Version = metadata.Version,
				Connector = metadata.Connector,
				TimestampMs = metadata.TsMs,
				Sequence = metadata.Seq
			},
			Operation = op,
			TimestampMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
		};

		switch (op)
		{
			case "c":
				valuePayload.After = res;
				break;
			case "u":
				valuePayload.Before = res.GetProperty("before");
				valuePayload.After = res.GetProperty("after");
				break;
			case "d":
				valuePayload.Before = res;
				break;
			default:
				throw new Exception("Unknown op: " + op);
		}

		return valuePayload;
	}

	static Schema GetValueSchema(EventMetadata metadata, JsonElement res)
	{
		var sourceFields = new Field {
			Type = "struct",
			Optional = false,
			Name = $"io.debezium.connector.{metadata.Connector}.Source",
			SchemaField = "source",
			Fields = new List<Field>
			{
				new Field
				{
					SchemaField = "version",
					Type = "string",
					Optional = false
				},
				new Field
				{
					SchemaField = "connector",
					Type = "string",
					Optional = false
				},
				new Field
				{
					SchemaField = "ts_ms",
					Type = "int64",
					Optional = false
				},
				new Field
				{
					SchemaField = "seq",
					Type = "int64",
					Optional = false
				}
			}
		};

		var metadataFields = new List<Field>
		{
			new Field
			{
				SchemaField = "op",
				Type = "string",
				Optional = false
			},
			new Field
			{
				SchemaField = "ts_ms",
				Type = "int64",
				Optional = true
			}
		};

		var beforeField = new Field
		{
			Type = "struct",
			Optional = true,
			Name = $"{metadata.Connector}.{metadata.QueryId}.Value",
			SchemaField = "before",
			Fields = GetChangeDataFields(res)
		};

		var afterField = new Field
		{
			Type = "struct",
			Optional = true,
			Name = $"{metadata.Connector}.{metadata.QueryId}.Value",
			SchemaField = "after",
			Fields = GetChangeDataFields(res)
		};

		var valueSchema = new Schema
		{
			Type = "struct",
			Name = $"{metadata.Connector}.{metadata.QueryId}.Value",
			Optional = false,
			Fields = new List<Field>
			{
				sourceFields,
				beforeField,
				afterField,
				new Field
				{
					SchemaField = "op",
					Type = "string",
					Optional = false
				},
				new Field
				{
					SchemaField = "ts_ms",
					Type = "int64",
					Optional = true
				}
			}
		};
		return valueSchema;
	}


	static List<Field> GetChangeDataFields(JsonElement changeData)
	{
		var changeDataFields = new List<Field>();
		foreach (var prop in changeData.EnumerateObject())
		{
			changeDataFields.Add(new Field
			{
				SchemaField = prop.Name,
				Type = prop.Value.ValueKind.ToString().ToLower(),
				Optional = false
			});
		}
		return changeDataFields;
	}
}
