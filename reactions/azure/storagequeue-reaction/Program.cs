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

var reaction = new ReactionBuilder()
    .UseChangeEventHandler<ChangeHandler>()
    .UseControlEventHandler<ControlSignalHandler>()
    .ConfigureServices((services) =>
    {
        services.AddSingleton<IChangeFormatter, ChangeFormatter>();
        services.AddSingleton<QueueClient>(sp => 
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var accountName = config.GetValue<string>("accountName");
            var accountKey = config.GetValue<string>("accountKey");
            var queueName = config.GetValue<string>("queueName");
            var serviceUri = $"https://{accountName}.queue.core.windows.net";            

            QueueServiceClient queueServiceClient;
            if (!String.IsNullOrEmpty(accountKey)) 
            {
                Console.WriteLine("Using Shared Key authentication");
                queueServiceClient = new QueueServiceClient(new Uri(serviceUri), new StorageSharedKeyCredential(accountName, accountKey));
            }
            else
            {
                Console.WriteLine("Using DefaultAzureCredential authentication");
                queueServiceClient = new QueueServiceClient(new Uri(serviceUri), new DefaultAzureCredential());
            }

            var result = queueServiceClient.GetQueueClient(queueName);
            if (!result.Exists())
            {
                throw new InvalidOperationException("queue does not exist");
            }

            return result;
        });
    })
    .Build();

await reaction.StartAsync();

