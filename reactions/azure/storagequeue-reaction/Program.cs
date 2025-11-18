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

using Azure;
using Azure.Identity;
using Azure.Storage;
using Azure.Storage.Queues;
using Drasi.Reaction.SDK;
using Drasi.Reactions.StorageQueue.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var reaction = new ReactionBuilder()
    .UseChangeEventHandler<ChangeHandler>()
    .UseControlEventHandler<ControlSignalHandler>()
    .ConfigureServices((services) =>
    {
        services.AddSingleton<IChangeFormatter, ChangeFormatter>();
        services.AddSingleton<ITemplateFormatter, TemplateFormatter>();
        services.AddSingleton<QueueClient>(sp =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var logger = sp.GetRequiredService<ILogger<ReactionBuilder>>();
            var queueName = config.GetValue<string>("queueName");
            QueueServiceClient queueServiceClient;
            var options = new QueueClientOptions
            {
                MessageEncoding = QueueMessageEncoding.Base64
            };

            switch (config.GetIdentityType())
            {
                case IdentityType.MicrosoftEntraWorkloadID:
                    logger.LogInformation("Using Microsoft Entra Workload ID");
                    var widEndpoint = config.GetValue<string>("endpoint");
                    if (String.IsNullOrEmpty(widEndpoint))
                    {
                        Reaction<object>.TerminateWithError("Endpoint not provided");
                    }
                    queueServiceClient = new QueueServiceClient(new Uri(widEndpoint), new DefaultAzureCredential(), options);
                    break;
                case IdentityType.ConnectionString:
                    logger.LogInformation("Using connection string");
                    queueServiceClient = new QueueServiceClient(config.GetConnectionString(), options);
                    break;
                default:
                    Reaction<object>.TerminateWithError("Service identity not provided");
                    throw new Exception("Service identity not provided");
            }

            return queueServiceClient.GetQueueClient(queueName);
        });
    })
    .Build();

if (!await reaction.Services.GetRequiredService<QueueClient>().ExistsAsync())
{
    Reaction<object>.TerminateWithError("queue does not exist");
}

await reaction.StartAsync();

