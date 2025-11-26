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

namespace Drasi.Reactions.EventBridge.Services;

using Amazon.EventBridge;
using Amazon.EventBridge.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using System;
using System.Text.Json;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.EventBridge.Models;

public class ChangeHandler : IChangeEventHandler<QueryConfig>
{
    private readonly ILogger<ChangeHandler> _logger;
    private readonly AmazonEventBridgeClient _eventBridgeClient;

    private readonly string _eventBusName;
    private readonly OutputFormat _format;

    private readonly IChangeFormatter? _formatter;
    private readonly HandlebarsChangeFormatter? _handlebarsFormatter;

    public ChangeHandler(AmazonEventBridgeClient eventBridgeClient, IConfiguration config, ILogger<ChangeHandler> logger, IChangeFormatter? formatter = null, HandlebarsChangeFormatter? handlebarsFormatter = null)
    {
        _eventBridgeClient = eventBridgeClient;
        _logger = logger;
        _eventBusName = config.GetValue<string>("eventBusName") ?? "default";
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _formatter = formatter;
        _handlebarsFormatter = handlebarsFormatter;
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? queryConfig)
    {
        _logger.LogInformation("Processing change for query " + evt.QueryId);
        switch (_format)
        {
            case OutputFormat.Packed:
                var cloudEvent = new CloudEvent
                {
                    Id = Guid.NewGuid().ToString(),
                    Type = "Drasi.ChangeEvent.Packed",
                    Source = evt.QueryId,
                    Data = evt,
                    Version = "1.0"
                };
                var packedRequestEntry = new PutEventsRequestEntry()
                {
                    Source = evt.QueryId,
                    Detail = JsonSerializer.Serialize(cloudEvent),
                    DetailType = "Drasi.ChangeEvent.Packed",
                    EventBusName = _eventBusName
                };
                var packedResponse = await _eventBridgeClient.PutEventsAsync(new PutEventsRequest()
                {
                    Entries = new List<PutEventsRequestEntry>() { packedRequestEntry }
                });

                if (packedResponse.FailedEntryCount > 0)
                {
                    _logger.LogError("Failed to send change event to EventBridge");
                }

                break;
            case OutputFormat.Unpacked:
                if (_formatter == null)
                {
                    throw new InvalidOperationException("Formatter not configured for Unpacked format");
                }
                var formattedResults = _formatter.Format(evt);
                List<PutEventsRequestEntry> unpackedRequestEntries = new List<PutEventsRequestEntry>();
                foreach (var result in formattedResults)
                {
                    var currCloudEvent = new CloudEvent
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = "Drasi.ChangeEvent.Unpacked",
                        Source = evt.QueryId,
                        Data = result,
                        Version = "1.0"
                    };
                    var unpackedRequestEntry = new PutEventsRequestEntry()
                    {
                        Source = evt.QueryId,
                        Detail = JsonSerializer.Serialize(currCloudEvent),
                        DetailType = "Drasi.ChangeEvent.Unpacked",
                        EventBusName = _eventBusName
                    };
                    unpackedRequestEntries.Add(unpackedRequestEntry);
                }
                var unpackedResponse = await _eventBridgeClient.PutEventsAsync(new PutEventsRequest()
                {
                    Entries = unpackedRequestEntries
                });

                if (unpackedResponse.FailedEntryCount > 0)
                {
                    _logger.LogError("Failed to send change event to EventBridge");
                }

                break;
            case OutputFormat.Handlebars:
                if (_handlebarsFormatter == null)
                {
                    throw new InvalidOperationException("Handlebars formatter not configured");
                }
                
                var handlebarsResults = _handlebarsFormatter.Format(evt, queryConfig);
                List<PutEventsRequestEntry> handlebarsRequestEntries = new List<PutEventsRequestEntry>();
                foreach (var result in handlebarsResults)
                {
                    var handlebarsRequestEntry = new PutEventsRequestEntry()
                    {
                        Source = evt.QueryId,
                        Detail = result.Data,
                        DetailType = $"Drasi.ChangeEvent.{result.Op}",
                        EventBusName = _eventBusName
                    };
                    
                    // Add metadata to the request if provided
                    if (result.Metadata != null && result.Metadata.Count > 0)
                    {
                        // Note: EventBridge doesn't have a direct metadata field, but we can add custom attributes
                        // The metadata is typically used for filtering and routing
                    }
                    
                    handlebarsRequestEntries.Add(handlebarsRequestEntry);
                }
                var handlebarsResponse = await _eventBridgeClient.PutEventsAsync(new PutEventsRequest()
                {
                    Entries = handlebarsRequestEntries
                });

                if (handlebarsResponse.FailedEntryCount > 0)
                {
                    _logger.LogError("Failed to send change event to EventBridge");
                }

                break;
            default:
                throw new NotSupportedException("Invalid output format");
        }

    }
}

enum OutputFormat
{
    Packed,
    Unpacked,
    Handlebars
}
