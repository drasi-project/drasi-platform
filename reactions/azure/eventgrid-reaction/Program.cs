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
using Azure;
using Azure.Identity;
using Azure.Messaging.EventGrid;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Drasi.Reactions.EventGrid.Services;

var reaction = new ReactionBuilder()
                .UseChangeEventHandler<ChangeHandler>()
                .ConfigureServices((services) => {
                    services.AddSingleton<EventGridPublisherClient>(sp =>
                    {
                        var configuration = sp.GetRequiredService<IConfiguration>();
                        var logger = sp.GetRequiredService<ILogger<EventGridPublisherClient>>();
                        var eventGridUri = configuration.GetValue<string>("eventGridUri");
                        // var eventGridKey = configuration.GetValue<string>("eventGridKey");

                        EventGridPublisherClient publisherClient; 
                        switch (configuration.GetIdentityType())
                        {
                            case IdentityType.MicrosoftEntraWorkloadID:
                                logger.LogInformation("Using Microsoft Entra Workload ID");

                                var widEndpoint = configuration.GetValue<string>("endpoint");
                                if (String.IsNullOrEmpty(widEndpoint))
                                {
                                    Reaction<object>.TerminateWithError("Endpoint not provided");
                                }

                                publisherClient =  new EventGridPublisherClient(
                                                    new Uri(eventGridUri
                                                    ),
                                                    new DefaultAzureCredential());
                                break;
                            case IdentityType.AccessKey:
                                logger.LogInformation("Using Access Key");

                                var eventGridKey = configuration.GetValue<string>("eventGridKey");
                                if (String.IsNullOrEmpty(eventGridKey))
                                {
                                    Reaction<object>.TerminateWithError("Event Grid Key not provided");
                                }

                                publisherClient =  new EventGridPublisherClient(
                                                    new Uri(eventGridUri),
                                                    new AzureKeyCredential(eventGridKey));
                                break;
                            default:
                                Reaction<object>.TerminateWithError("Service identity not provided");
                                throw new Exception("Service identity not provided");
                        }
                        return publisherClient;
                    });
                })
                .Build();


await reaction.StartAsync();
