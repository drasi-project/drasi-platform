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


using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.Debezium
{
	public class DebeziumService
	{
		private string _topic;

		private bool _includeSchemas;

		private bool _includeKey;

		private ProducerConfig _config;


		public DebeziumService(IConfiguration configuration, ILogger<DebeziumService> logger)
		{
			var brokers = configuration["Brokers"];
			_topic = configuration["Topic"];
			_includeSchemas = bool.Parse(configuration["IncludeSchemas"]);
			_includeKey = bool.Parse(configuration["IncludeKey"]);

			_config = new ProducerConfig
			{
				BootstrapServers = brokers
			};

		}

		public ProducerConfig Config => _config;

		public string Topic => _topic;

		public bool IncludeSchemas => _includeSchemas;

		public bool IncludeKey => _includeKey;
	}
}
