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
	
	private DataChangeEventFormatter _formatter;

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

		_formatter = new DataChangeEventFormatter(_includeKey, _includeSchemas);
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
			string eventString = _formatter.FormatEvent(metadata, res, op);

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

}
