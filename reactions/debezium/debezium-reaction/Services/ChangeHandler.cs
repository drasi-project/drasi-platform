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


	private readonly string _topic;
	
	private IDataChangeEventFormatter _formatter;

	public DebeziumChangeHandler(IProducer<Null, string> producer, IConfiguration config, ILogger<DebeziumChangeHandler> logger, IDataChangeEventFormatter formatter)
	{
		_logger = logger;
		_topic = config.GetValue<string>("topic") ?? throw new ArgumentNullException("Debezium topic is required");
		
		
		_producer = producer;
		_formatter = formatter;
	}

	public async Task HandleChange(ChangeEvent evt, object? queryConfig)
	{
		var metadata = new EventMetadata(evt);
		
		_logger.LogInformation("Processing {QueryId}", metadata.QueryId);

		List<string> messageList = _formatter.ProcessChangeEvent(metadata, evt);

		try {
			_producer.BeginTransaction();

			foreach (string message in messageList)
			{
				_logger.LogInformation($"dataChangeEvent: {message}");
				
					var deliveryReport = await _producer.ProduceAsync(_topic, new Message<Null, string> { Value = message }, CancellationToken.None);

					if (deliveryReport.Status != PersistenceStatus.Persisted)
					{
						throw new Exception($"Delivery failed: {deliveryReport.Message.Value}");
					}
					else
					{
						_logger.LogInformation($"Message delivered to {deliveryReport.TopicPartitionOffset}");
					}
			}
			_producer.CommitTransaction();
		}
		catch (ProduceException<Null, string> ex)
		{
			_logger.LogError($"Delivery failed: {ex.Error.Reason}");
			_producer.AbortTransaction();
		}
		catch (Exception ex)
		{
			_logger.LogError($"An error occurred: {ex.Message}");
			_producer.AbortTransaction();
		}

		

		_producer.Flush();
	}
}
