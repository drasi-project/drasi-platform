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
using HandlebarsDotNet;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.PostDaprOutputBinding.Services;

public class ChangeHandler : IChangeEventHandler<QueryConfig>
{
    private readonly DaprClient _daprClient;
    private readonly IChangeFormatterFactory _formatterFactory;
    private readonly ILogger<ChangeHandler> _logger;
    private readonly IQueryFailureTracker _failureTracker;
    private readonly Dictionary<string, string> _metadataConfigurations;
    
    public ChangeHandler(
        DaprClient daprClient, 
        IChangeFormatterFactory formatterFactory, 
        ILogger<ChangeHandler> logger,
        IQueryFailureTracker failureTracker,
        IConfiguration configuration)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _formatterFactory = formatterFactory ?? throw new ArgumentNullException(nameof(formatterFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _failureTracker = failureTracker ?? throw new ArgumentNullException(nameof(failureTracker));
        var metadataSection = configuration.GetSection("metadata");
        var s1 = metadataSection.GetChildren();
        _metadataConfigurations = metadataSection.GetChildren()
            .ToDictionary(s => s.Key, s => s.Value ?? string.Empty);
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? config)
    {
        var queryId = evt.QueryId;
        var queryConfig = config
            ?? throw new ArgumentNullException(nameof(config), $"Query configuration is null for query {queryId}");
            
        // Check if the query is already in a failed state
        if (_failureTracker.IsQueryFailed(queryId))
        {
            var reason = _failureTracker.GetFailureReason(queryId);
            _logger.LogError("Rejecting change event for failed query {QueryId}. Reason: {Reason}", queryId, reason);
            throw new InvalidOperationException($"Query {queryId} is in a failed state: {reason}");
        }

        _logger.LogDebug("Processing change event for query {QueryId} with binding {BindingName} of type {BindingType}",
            queryId, queryConfig.BindingName, queryConfig.BindingType);

        try
        {
            if (queryConfig.Packed == OutputFormat.Packed)
            {
                // Send the complete change event as a single message
                await PublishPackedEvent(evt, queryConfig);
            }
            else
            {
                // Format and send individual events for each change
                await PublishUnpackedEvents(evt, queryConfig);
            }
            
            // Reset failure count on success
            _failureTracker.ResetFailures(queryId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing event for query {QueryId}", queryId);
            
            // Track failure and check if query should be marked as failed
            var exceptionMessage = $"{ex.Message} {ex.InnerException?.Message}";
            // Serialize the exception message for logging
            //var exJson = JsonSerializer.Serialize(ex, ModelOptions.JsonOptions);
            //_logger.LogError("Exception details: {ExceptionJson}", exJson);
            bool isFailed = _failureTracker.RecordFailure(
                queryId, 
                queryConfig.MaxFailureCount, 
                $"Error publishing to Dapr output binding: {exceptionMessage}");

            if (isFailed)
            {
                _logger.LogError("Query {QueryId} has been marked as failed after {MaxFailureCount} consecutive failures", 
                    queryId, queryConfig.MaxFailureCount);
            }
            
            throw; // Rethrow to let Drasi SDK handle the failure
        }
    }

    private Dictionary<string, string>? RenderMetadata(string source)
    {
        if (_metadataConfigurations.Count == 0) return null;
        ;
        var template = Handlebars.Compile(source);
        var rendered = template(_metadataConfigurations);
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, string>>(rendered, ModelOptions.JsonOptions)
                   ?? null;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize metadata from rendered template: {Rendered}", rendered);
            throw;
        }
    }
    
    
    private async Task PublishPackedEvent(ChangeEvent evt, QueryConfig queryConfig)
    {
        var serializedEvent = JsonSerializer.Serialize(evt, ModelOptions.JsonOptions);
        using var doc = JsonDocument.Parse(serializedEvent);
        // Render metadata if provided
        var metadata = RenderMetadata(queryConfig.BindingMetadataTemplate);
        await _daprClient.InvokeBindingAsync(bindingName: queryConfig.BindingName, operation: queryConfig.BindingOperation, 
            data: doc.RootElement, metadata: metadata);
        _logger.LogDebug("Published packed event for query {QueryId}", evt.QueryId);
    }
    
    private async Task PublishUnpackedEvents(ChangeEvent evt, QueryConfig queryConfig)
    {
        var formatter = _formatterFactory.GetFormatter();
        var events = formatter.Format(evt);

        var jsonElements = events as JsonElement[] ?? events.ToArray();
        var metadata = RenderMetadata(queryConfig.BindingMetadataTemplate);
        foreach (var eventData in jsonElements)
        {
            await _daprClient.InvokeBindingAsync(bindingName: queryConfig.BindingName, operation: queryConfig.BindingOperation, 
                data: eventData, metadata: metadata);
        }
        
        _logger.LogDebug("Published {Count} unpacked events for query {QueryId}",
            jsonElements.Length, evt.QueryId);
    }
}