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

using System.Text.Json;
using Dapr.Client;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.PostDaprOutputBinding.Models.Unpacked;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.PostDaprOutputBinding.Services;

public class ControlSignalHandler : IControlEventHandler<QueryConfig>
{
    private readonly DaprClient _daprClient;
    private readonly ILogger<ControlSignalHandler> _logger;
    private readonly IQueryFailureTracker _failureTracker;

    public ControlSignalHandler(
        DaprClient daprClient, 
        ILogger<ControlSignalHandler> logger,
        IQueryFailureTracker failureTracker)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _failureTracker = failureTracker ?? throw new ArgumentNullException(nameof(failureTracker));
    }

    public async Task HandleControlSignal(ControlEvent evt, QueryConfig? config)
    {
        var queryId = evt.QueryId;
        var queryConfig = config
            ?? throw new ArgumentNullException(nameof(config), $"Query configuration is null for query {queryId}");

        // Check if the query is already in a failed state
        if (_failureTracker.IsQueryFailed(queryId))
        {
            var reason = _failureTracker.GetFailureReason(queryId);
            _logger.LogError("Rejecting control signal for failed query {QueryId}. Reason: {Reason}", queryId, reason);
            throw new InvalidOperationException($"Query {queryId} is in a failed state: {reason}");
        }

        if (queryConfig.SkipControlSignals)
        {
            _logger.LogDebug("Skipping control signal {SignalType} for query {QueryId} (skipControlSignals=true)",
                evt.ControlSignal.Kind, queryId);
            return;
        }

        _logger.LogDebug("Processing control signal {SignalType} for query {QueryId} with binding {BindingName} of type {BindingType} with {Operation}",
            evt.ControlSignal.Kind, queryId, queryConfig.BindingName, queryConfig.BindingType, queryConfig.BindingOperation);

        try
        {
            if (queryConfig.Packed == OutputFormat.Packed)
            {
                // Send the complete control event as a single message
                var serializedEvent = JsonSerializer.Serialize(evt, ModelOptions.JsonOptions);
                using var doc = JsonDocument.Parse(serializedEvent);
                await _daprClient.InvokeBindingAsync(bindingName: queryConfig.BindingName, operation: queryConfig.BindingOperation, 
                    data: doc.RootElement);
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
                var serializedEvent = doc.RootElement.Clone();

                await _daprClient.InvokeBindingAsync(bindingName: queryConfig.BindingName, operation: queryConfig.BindingOperation, 
                    data: serializedEvent);
                _logger.LogDebug("Published unpacked control signal for query {QueryId}", queryId);
            }
            
            // Reset failure count on success
            _failureTracker.ResetFailures(queryId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing control signal for query {QueryId}", queryId);
            
            // Track failure and check if query should be marked as failed
            bool isFailed = _failureTracker.RecordFailure(
                queryId, 
                queryConfig.MaxFailureCount, 
                $"Error publishing control signal to Dapr output binding: {ex.Message}");
            
            if (isFailed)
            {
                _logger.LogError("Query {QueryId} has been marked as failed after {MaxFailureCount} consecutive failures", 
                    queryId, queryConfig.MaxFailureCount);
            }
            
            throw; // Rethrow to let Drasi SDK handle the failure
        }
    }
}