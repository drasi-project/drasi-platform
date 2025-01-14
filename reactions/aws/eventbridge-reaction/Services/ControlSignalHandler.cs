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
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.EventBridge.Models.Unpacked;

using Amazon.EventBridge;
using Amazon.EventBridge.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using System.Text.Json;


namespace Drasi.Reactions.EventBridge.Services;

public class ControlSignalHandler: IControlEventHandler
{
    private readonly AmazonEventBridgeClient _client;
    private readonly OutputFormat _format;

    private readonly ILogger<ControlSignalHandler> _logger;

    private readonly string _eventBusName;

    public ControlSignalHandler(AmazonEventBridgeClient client, IConfiguration config, ILogger<ControlSignalHandler> logger)
    {
        _client = client;
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _logger = logger;
        _eventBusName = config.GetValue<string>("eventBusName") ?? "default";
    }

    public async Task HandleControlSignal(ControlEvent evt, object? queryConfig)
    {
        switch (_format)
        {
            case OutputFormat.Packed:
                var requestEntry =  new PutEventsRequestEntry()
                {
                    Source = evt.QueryId,
                    Detail = JsonSerializer.Serialize(evt),
                    DetailType = "Drasi.ControlEvent",
                    EventBusName = _eventBusName
                };
                var response = await _client.PutEventsAsync(new PutEventsRequest()
                {
                    Entries = new List<PutEventsRequestEntry>() { requestEntry }
                });

                if (response.FailedEntryCount > 0)
                {
                    _logger.LogError("Failed to send control event to eventbridge");
                }

                break;
            case OutputFormat.Unpacked:
                var notification = new ControlSignalNotification
                {
                    Op = ControlSignalNotificationOp.X,
                    TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Payload = new ControlSignalNotificationPayload()
                    {
                        Kind = JsonSerializer.Serialize(evt.ControlSignal.Kind, Reaction.SDK.Models.QueryOutput.ModelOptions.JsonOptions).Trim('"'),
                        Source = new SourceClass()
                        {
                            QueryId = evt.QueryId,
                            TsMs = evt.SourceTimeMs
                        },                        
                    }
                };

                var unpackedRequestEntry = new PutEventsRequestEntry()
                {
                    Source = evt.QueryId,
                    Detail = JsonSerializer.Serialize(notification, Reaction.SDK.Models.QueryOutput.ModelOptions.JsonOptions),
                    DetailType = "Drasi.ControlEvent",
                    EventBusName = _eventBusName
                };

                var unpackedResponse = await _client.PutEventsAsync(new PutEventsRequest()
                {
                    Entries = new List<PutEventsRequestEntry>() { unpackedRequestEntry }
                });

                if (unpackedResponse.FailedEntryCount > 0)
                {
                    _logger.LogError("Failed to send control event to eventbridge");
                }

                break;
            default:
                throw new Exception("Invalid output format");
        }
    }
}
   

