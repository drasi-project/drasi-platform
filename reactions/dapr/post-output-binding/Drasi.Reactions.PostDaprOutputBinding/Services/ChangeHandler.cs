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

using System.Dynamic;
using System.Text.Json;
using Dapr.Client;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Grpc.Core;
using HandlebarsDotNet;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.PostDaprOutputBinding.Services;

public class ChangeHandler(
    DaprClient daprClient,
    IChangeFormatterFactory formatterFactory,
    ILogger<ChangeHandler> logger,
    IQueryFailureTracker failureTracker)
    : IChangeEventHandler<QueryConfig>
{
    private readonly DaprClient _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
    private readonly IChangeFormatterFactory _formatterFactory = formatterFactory ?? throw new ArgumentNullException(nameof(formatterFactory));
    private readonly ILogger<ChangeHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    private readonly IQueryFailureTracker _failureTracker = failureTracker ?? throw new ArgumentNullException(nameof(failureTracker));

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

    private Dictionary<string, string>? RenderMetadata(string source, object? result)
    {
        if (string.IsNullOrWhiteSpace(source) || result is null)
        {
            _logger.LogDebug("Metadata template is empty or null, skipping rendering.");
            return null;
        }
        var template = Handlebars.Compile(source);
        var rendered = template(result);
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
        await _daprClient.InvokeBindingAsync(bindingName: queryConfig.BindingName, operation: queryConfig.BindingOperation, 
            data: doc.RootElement);
        _logger.LogDebug("Published packed event for query {QueryId}", evt.QueryId);
    }
    
    private async Task PublishUnpackedEvents(ChangeEvent evt, QueryConfig queryConfig)
    {
        var formatter = _formatterFactory.GetFormatter();
        var events = formatter.Format(evt);

        var jsonElements = events as JsonElement[] ?? events.ToArray();
        foreach (var eventData in jsonElements)
        {
            
            var metadata = RenderMetadata(JsonSerializer.Serialize(queryConfig.BindingMetadataTemplate), ConvertValue(eventData));
            try
            {
                await _daprClient.InvokeBindingAsync(bindingName: queryConfig.BindingName,
                    operation: queryConfig.BindingOperation,
                    data: eventData, metadata: metadata);
            }
            catch (Exception e)
            {
                _logger.LogError("Failed to publish event for query {QueryId} with error: {ErrorMessage}", 
                    evt.QueryId, e.Message);
                _logger.LogError("Event data: {EventData}", JsonSerializer.Serialize(eventData));
            }
        }
        
        _logger.LogDebug("Published {Count} unpacked events for query {QueryId}",
            jsonElements.Length, evt.QueryId);
    }
    
    private static ExpandoObject ToExpando(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object)
            throw new ArgumentException("Root element must be an object", nameof(element));

        IDictionary<string, object?> expando = new ExpandoObject();

        foreach (var prop in element.EnumerateObject())
        {
            expando[prop.Name] = ConvertValue(prop.Value);
        }

        return (ExpandoObject)expando;
    }
    
    private static object? ConvertValue(JsonElement element)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Object:
                return ToExpando(element);

            case JsonValueKind.Array:
                var list = new List<object?>();
                foreach (var item in element.EnumerateArray())
                    list.Add(ConvertValue(item));
                return list;

            case JsonValueKind.String:
                return element.GetString();

            case JsonValueKind.Number:
                if (element.TryGetInt64(out var l))    return l;
                if (element.TryGetDouble(out var d))   return d;
                return element.GetDecimal();

            case JsonValueKind.True:
            case JsonValueKind.False:
                return element.GetBoolean();

            case JsonValueKind.Null:
            case JsonValueKind.Undefined:
                return null;

            default:
                return element.GetRawText();
        }
    }


}