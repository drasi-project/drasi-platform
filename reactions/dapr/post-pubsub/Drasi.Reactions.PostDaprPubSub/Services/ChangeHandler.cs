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
using Microsoft.Extensions.Logging;
using System.Text.Json;

public class ChangeHandler : IChangeEventHandler<QueryConfig>
{
    private readonly DaprClient _daprClient;
    private readonly IChangeFormatterFactory _formatterFactory;
    private readonly ILogger<ChangeHandler> _logger;

    public ChangeHandler(
        DaprClient daprClient, 
        IChangeFormatterFactory formatterFactory, 
        ILogger<ChangeHandler> logger)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _formatterFactory = formatterFactory ?? throw new ArgumentNullException(nameof(formatterFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? config)
    {
        var queryId = evt.QueryId;
        var queryConfig = config
            ?? throw new ArgumentNullException(nameof(config), $"Query configuration is null for query {queryId}");

        _logger.LogDebug("Processing change event for query {QueryId} with pubsub {PubsubName} and topic {TopicName}",
            queryId, queryConfig.PubsubName, queryConfig.TopicName);

        if (queryConfig.Format == OutputFormat.Packed)
        {
            // Send the complete change event as a single message
            await PublishPackedEvent(evt, queryConfig);
        }
        else
        {
            // Format and send individual events for each change
            await PublishUnpackedEvents(evt, queryConfig);
        }
    }
    
    private async Task PublishPackedEvent(ChangeEvent evt, QueryConfig queryConfig)
    {
        var serializedEvent = JsonSerializer.Serialize(evt, ModelOptions.JsonOptions);
        using var doc = JsonDocument.Parse(serializedEvent);
        await _daprClient.PublishEventAsync(queryConfig.PubsubName, queryConfig.TopicName, doc.RootElement);
        _logger.LogDebug("Published packed event for query {QueryId}", evt.QueryId);
    }
    
    private async Task PublishUnpackedEvents(ChangeEvent evt, QueryConfig queryConfig)
    {
        IChangeFormatter formatter;
        
        // Use template formatter if templates are configured
        if (queryConfig.Templates != null && HasAnyTemplate(queryConfig.Templates))
        {
            formatter = _formatterFactory.GetTemplateFormatter(queryConfig.Templates, evt.QueryId);
            _logger.LogDebug("Using Handlebars template formatter for query {QueryId}", evt.QueryId);
        }
        else
        {
            formatter = _formatterFactory.GetFormatter();
        }
        
        var events = formatter.Format(evt);
        
        foreach (var eventData in events)
        {
            await _daprClient.PublishEventAsync(queryConfig.PubsubName, queryConfig.TopicName, eventData);
        }
        
        _logger.LogDebug("Published {Count} unpacked events for query {QueryId}", 
            events.Count(), evt.QueryId);
    }
    
    private static bool HasAnyTemplate(TemplateConfig templates)
    {
        return !string.IsNullOrEmpty(templates.Added) 
            || !string.IsNullOrEmpty(templates.Updated) 
            || !string.IsNullOrEmpty(templates.Deleted);
    }
}