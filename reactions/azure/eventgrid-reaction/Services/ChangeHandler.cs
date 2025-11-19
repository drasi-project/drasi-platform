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
using Drasi.Reactions.EventGrid.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Drasi.Reactions.EventGrid.Models.Unpacked;



public class ChangeHandler : IChangeEventHandler<QueryConfig>
{
    private readonly EventGridPublisherClient _publisherClient;
    private readonly OutputFormat _format;
    private readonly IChangeFormatter _formatter;
    private readonly TemplateChangeFormatter _templateFormatter;
    private readonly ILogger<ChangeHandler> _logger;

    private readonly EventGridSchema _eventGridSchema;

    public ChangeHandler(EventGridPublisherClient publisherClient, IConfiguration config, IChangeFormatter formatter, TemplateChangeFormatter templateFormatter, ILogger<ChangeHandler> logger)
    {
        _publisherClient = publisherClient;
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _formatter = formatter;
        _templateFormatter = templateFormatter;
        _logger = logger;
        _eventGridSchema = Enum.Parse<EventGridSchema>(config.GetValue<string>("eventGridSchema"));
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? queryConfig)
    {
        _logger.LogInformation("Processing " + evt.QueryId);
        switch(_format)
        {
            case OutputFormat.Packed:
                if (_eventGridSchema == EventGridSchema.CloudEvents) {
                    var formattedEvent = _formatter.Format(evt);
                    CloudEvent currEvent = new CloudEvent(evt.QueryId, "Drasi.ChangeEvent", formattedEvent);
                    var resp = await _publisherClient.SendEventAsync(currEvent);
                    if (resp.IsError) 
                    {
                        _logger.LogError($"Error sending message to Event Grid: {resp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {resp.Content.ToString()}");
                    }
                } else if (_eventGridSchema == EventGridSchema.EventGrid) {
                    var formattedEvent = _formatter.Format(evt);
                    EventGridEvent egEvent = new EventGridEvent(evt.QueryId, "Drasi.ChangeEvent", "1", formattedEvent);
                    var resp = await _publisherClient.SendEventAsync(egEvent);
                    if (resp.IsError) 
                    {
                        _logger.LogError($"Error sending message to Event Grid: {resp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {resp.Content.ToString()}");
                    }
                }
                break;
                
            case OutputFormat.Unpacked:
                var formattedResults = _formatter.Format(evt);
                if (_eventGridSchema == EventGridSchema.EventGrid) {
                    List<EventGridEvent> events = new List<EventGridEvent>();
                    foreach (var notification in formattedResults)
                    {
                        EventGridEvent currEvent = new EventGridEvent(evt.QueryId, "Drasi.ChangeEvent", "1", notification);
                        events.Add(currEvent);
                    }
                    var currResp = await _publisherClient.SendEventsAsync(events);
                    if (currResp.IsError) 
                    {
                        _logger.LogError($"Error sending message to Event Grid: {currResp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {currResp.Content.ToString()}");
                    }
                } else if (_eventGridSchema == EventGridSchema.CloudEvents) {
                    JsonElement serializedEvent;
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
                }
            
                break;

            case OutputFormat.Template:
                var templateResults = _templateFormatter.Format(evt, queryConfig);
                if (_eventGridSchema == EventGridSchema.EventGrid) {
                    List<EventGridEvent> templateEvents = new List<EventGridEvent>();
                    foreach (var templateNotification in templateResults)
                    {
                        EventGridEvent templateEvent = new EventGridEvent(evt.QueryId, "Drasi.ChangeEvent", "1", templateNotification);
                        templateEvents.Add(templateEvent);
                    }
                    var templateResp = await _publisherClient.SendEventsAsync(templateEvents);
                    if (templateResp.IsError) 
                    {
                        _logger.LogError($"Error sending message to Event Grid: {templateResp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {templateResp.Content.ToString()}");
                    }
                } else if (_eventGridSchema == EventGridSchema.CloudEvents) {
                    List<CloudEvent> templateCloudEvents = new List<CloudEvent>();
                    foreach (var templateNotification in templateResults)
                    {
                        CloudEvent templateCloudEvent = new CloudEvent(evt.QueryId, "Drasi.ChangeEvent", templateNotification);
                        templateCloudEvents.Add(templateCloudEvent);
                    }
                    var templateCloudResp = await _publisherClient.SendEventsAsync(templateCloudEvents);
                    if (templateCloudResp.IsError) 
                    {
                        _logger.LogError($"Error sending message to Event Grid: {templateCloudResp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {templateCloudResp.Content.ToString()}");
                    }
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
    Template
}

enum EventGridSchema
{
    CloudEvents,
    EventGrid
}   