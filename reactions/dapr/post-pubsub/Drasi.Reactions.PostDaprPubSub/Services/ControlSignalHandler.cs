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

namespace Drasi.Reactions.PostDaprPubSub.Services;

using Dapr.Client;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.PostDaprPubSub.Models.Unpacked;
using Microsoft.Extensions.Logging;
using System.Text.Json;

public class ControlSignalHandler : IControlEventHandler<QueryConfig>
{
    private readonly DaprClient _daprClient;
    private readonly ILogger<ControlSignalHandler> _logger;

    public ControlSignalHandler(
        DaprClient daprClient, 
        ILogger<ControlSignalHandler> logger)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task HandleControlSignal(ControlEvent evt, QueryConfig? config)
    {
        var queryId = evt.QueryId;
        var queryConfig = config
            ?? throw new ArgumentNullException(nameof(config), $"Query configuration is null for query {queryId}");

        if (queryConfig.SkipControlSignals)
        {
            _logger.LogDebug("Skipping control signal {SignalType} for query {QueryId} (skipControlSignals=true)",
                evt.ControlSignal.Kind, queryId);
            return;
        }

        _logger.LogDebug("Processing control signal {SignalType} for query {QueryId} with pubsub {PubsubName} and topic {TopicName}",
            evt.ControlSignal.Kind, queryId, queryConfig.PubsubName, queryConfig.TopicName);

        if (queryConfig.Format == OutputFormat.Packed)
        {
            // Send the complete control event as a single message
            var serializedEvent = JsonSerializer.Serialize(evt, ModelOptions.JsonOptions);
            using var doc = JsonDocument.Parse(serializedEvent);
            await _daprClient.PublishEventAsync(queryConfig.PubsubName, queryConfig.TopicName, doc.RootElement);
            _logger.LogDebug("Published packed control signal for query {QueryId}", queryId);
        }
        else
        {
            // Create and send an unpacked control signal
            var notification = new ControlSignalNotification
            {
                Op = ControlSignalNotificationOp.X,
                TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Payload = new ControlSignalNotificationPayload()
                {
                    Kind = JsonSerializer.Serialize(evt.ControlSignal.Kind, ModelOptions.JsonOptions).Trim('"'),
                    Source = new SourceClass()
                    {
                        QueryId = queryId,
                        TsMs = evt.SourceTimeMs
                    }
                }
            };

            var serializedData = JsonSerializer.Serialize(notification, Converter.Settings);
            using var doc = JsonDocument.Parse(serializedData);
            JsonElement serializedEvent = doc.RootElement.Clone();

            await _daprClient.PublishEventAsync(queryConfig.PubsubName, queryConfig.TopicName, serializedEvent);
            _logger.LogDebug("Published unpacked control signal for query {QueryId}", queryId);
        }
    }
}