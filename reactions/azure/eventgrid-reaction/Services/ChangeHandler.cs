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

namespace Drasi.Reactions.EventGrid.Services;

using Azure.Messaging.EventGrid;
using Azure.Messaging;


using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

// using CloudNative.CloudEvents;


public class ChangeHandler : IChangeEventHandler
{
    private readonly EventGridPublisherClient _publisherClient;
    private readonly OutputFormat _format;
    private readonly IChangeFormatter _formatter;
    private readonly ILogger<ChangeHandler> _logger;

    public ChangeHandler(EventGridPublisherClient publisherClient,IConfiguration config, IChangeFormatter formatter, ILogger<ChangeHandler> logger)
    {
        _publisherClient = publisherClient;
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _formatter = formatter;
        _logger = logger;
    }

    public async Task HandleChange(ChangeEvent evt, object? queryConfig)
    {
        _logger.LogInformation("Processing " + evt.QueryId);
        switch(_format)
        {
            case OutputFormat.Packed:
                CloudEvent egEvent = new CloudEvent(evt.QueryId, "Drasi.ChangeEvent", _formatter.Format(evt));
                var resp = await _publisherClient.SendEventAsync(egEvent);
                if (resp.IsError) 
                {
                    _logger.LogError($"Error sending message to Event Grid: {resp.Content.ToString()}");
                    throw new Exception($"Error sending message to Event Grid: {resp.Content.ToString()}");
                }
                break;
            case OutputFormat.Unpacked:
                var formattedResults = _formatter.Format(evt);
                List<CloudEvent> events = new List<CloudEvent>();
                foreach (var notification in formattedResults)
                {
                    CloudEvent currEvent = new CloudEvent(evt.QueryId, "Drasi.ChangeEvent", notification);
                    events.Add(currEvent);
                }
                var currResp = await _publisherClient.SendEventsAsync(events);
                if (currResp.IsError) 
                {
                    _logger.LogError($"Error sending message to Event Grid: {currResp.Content.ToString()}");
                    throw new Exception($"Error sending message to Event Grid: {currResp.Content.ToString()}");
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
    Unpacked
}