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

using Drasi.Reaction.SDK;
using Drasi.Reactions.Debezium.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

using Confluent.Kafka;


var reaction = new ReactionBuilder()
            .UseChangeEventHandler<DebeziumChangeHandler>()
            .ConfigureServices((services) =>
            {
                services.AddSingleton<IProducer<Null, string>>(sp =>
                {
                    var config = sp.GetRequiredService<IConfiguration>();
                    // A list of brokers; represented as a comma-separated string
                    string brokers = config.GetValue<string>("brokers") ?? throw new ArgumentNullException("Debezium brokers is required");

                    // Using UTF-8 for the key and value serialization 
                    // This allos us to send JSON string as JSON object 
                    return new ProducerBuilder<Null, string>(new ProducerConfig { BootstrapServers = brokers })
                            .SetValueSerializer(Serializers.Utf8)
                            .Build();
                });
            })
            .Build();

await reaction.StartAsync();
