// // Copyright 2024 The Drasi Authors.
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     http://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.


// using Confluent.Kafka;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Logging;

// namespace Drasi.Reactions.Debezium.Services
// {
// 	public class DebeziumService
// 	{
// 		private readonly string _topic;

// 		private readonly bool _includeSchemas;

// 		private readonly bool _includeKey;

// 		private readonly ProducerConfig _config;


// 		public DebeziumService(IConfiguration configuration, ILogger<DebeziumService> logger)
// 		{
// 			var brokers = configuration["brokers"];
//             Console.WriteLine("Brokers: " + brokers);
// 			_topic = configuration["topic"] ?? throw new ArgumentNullException("Debezium topic is required");
//             _includeSchemas = configuration.GetValue<bool?>("includeSchemas") ?? true;
//             _includeKey = configuration.GetValue<bool?>("includeKey") ?? true;

// 			_config = new ProducerConfig
// 			{
// 				BootstrapServers = brokers
// 			};

// 		}

// 		public ProducerConfig Config => _config;

// 		public string Topic => _topic;

// 		public bool IncludeSchemas => _includeSchemas;

// 		public bool IncludeKey => _includeKey;
// 	}
// }
