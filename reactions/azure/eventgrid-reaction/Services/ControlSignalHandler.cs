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
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Azure.Messaging.EventGrid;
using Azure.Messaging;
// using Azure.Messaging.CloudEvents;

using System.Text.Json;
using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Drasi.Reactions.EventGrid.Models.Unpacked;

public class ControlSignalHandler: IControlEventHandler
{
    private readonly EventGridPublisherClient _publisherClient;
    private readonly OutputFormat _format;

    private readonly ILogger<ControlSignalHandler> _logger;

    private readonly EventGridSchema _eventGridSchema;

    public ControlSignalHandler(EventGridPublisherClient publisherClient, IConfiguration config, ILogger<ControlSignalHandler> logger)
    {
        _publisherClient = publisherClient;
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _logger = logger;
        _eventGridSchema = Enum.Parse<EventGridSchema>(config.GetValue<string>("eventGridSchema") ?? "CloudEvents", true);
    }

    public async Task HandleControlSignal(ControlEvent evt, object? queryConfig)
    {
        switch (_format)
        {
            case OutputFormat.Packed:
                if (_eventGridSchema == EventGridSchema.CloudEvents)
                {
                    var serializedDataJson = JsonSerializer.Serialize(
                        evt,
                        Drasi.Reactions.EventGrid.Models.Unpacked.Converter.Settings
                    );

                    using var doc = JsonDocument.Parse(serializedDataJson);
                    JsonElement serializedEvent = doc.RootElement.Clone();

                    CloudEvent egEvent = new CloudEvent(evt.QueryId, "Drasi.ControlSignal", serializedEvent);
                    var resp = await _publisherClient.SendEventAsync(egEvent);
                    if (resp.IsError)
                    {
                        _logger.LogError($"Error sending message to Event Grid: {resp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {resp.Content.ToString()}");
                    }
                    break;
                } else if (_eventGridSchema == EventGridSchema.EventGrid)
                {
                    var serializedDataJson = JsonSerializer.Serialize(
                        evt,
                        Drasi.Reactions.EventGrid.Models.Unpacked.Converter.Settings
                    );

                    using var doc = JsonDocument.Parse(serializedDataJson);
                    JsonElement serializedEvent = doc.RootElement.Clone();

                    EventGridEvent egEvent = new EventGridEvent(evt.QueryId, "Drasi.ControlSignal", "1", serializedEvent);
                    var resp = await _publisherClient.SendEventAsync(egEvent);
                    if (resp.IsError)
                    {
                        _logger.LogError($"Error sending message to Event Grid: {resp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {resp.Content.ToString()}");
                    }
                    break;
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

                if (_eventGridSchema == EventGridSchema.EventGrid)
                {
                    var serializedDataJson = JsonSerializer.Serialize(
                        notification,
                        Drasi.Reactions.EventGrid.Models.Unpacked.Converter.Settings
                    );
                    using var doc = JsonDocument.Parse(serializedDataJson);
                    JsonElement serializedEvent = doc.RootElement.Clone();

                    EventGridEvent egEvent = new EventGridEvent(
                        subject: evt.QueryId,
                        eventType: "Drasi.ControlSignal",
                        dataVersion: "1",
                        data: serializedEvent
                    );
                    var resp = await _publisherClient.SendEventAsync(egEvent);
                    if (resp.IsError)
                    {
                        _logger.LogError($"Error sending message to Event Grid: {resp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {resp.Content.ToString()}");
                    }
                    break;
                } else if (_eventGridSchema == EventGridSchema.CloudEvents)
                {
                    var serializedDataJson = JsonSerializer.Serialize(
                        notification,
                        Drasi.Reactions.EventGrid.Models.Unpacked.Converter.Settings
                    );
                    using var doc = JsonDocument.Parse(serializedDataJson);
                    JsonElement serializedEvent = doc.RootElement.Clone();

                    CloudEvent unpackedEvent = new CloudEvent(evt.QueryId, "Drasi.ControlSignal", serializedEvent);
                    var dzresp = await _publisherClient.SendEventAsync(unpackedEvent);
                    if (dzresp.IsError)
                    {
                        _logger.LogError($"Error sending message to Event Grid: {dzresp.Content.ToString()}");
                        throw new Exception($"Error sending message to Event Grid: {dzresp.Content.ToString()}");
                    }
                    break;
                }
                break;
            default:
                throw new Exception("Invalid output format");
        }
    }
}