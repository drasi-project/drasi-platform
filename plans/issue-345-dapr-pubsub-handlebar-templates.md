# Implementation Plan: Output Templating in Dapr PubSub Reaction

**Issue:** [#345](https://github.com/drasi-project/drasi-platform/issues/345)  
**Feature:** Add handlebar template support to Dapr PubSub Reaction for output formatting

## Overview

Currently, the Dapr PubSub reaction supports two output formats:
- **Packed**: Entire ChangeEvent sent as a single message
- **Unpacked**: Individual messages for each change using Drasi native format

This plan adds a third option: **Templated** output, allowing users to define custom message formats using Handlebars templates, similar to how the Sync Vector Store and MCP reactions work.

## Current State Analysis

### Existing Reactions with Handlebar Support

1. **Sync Vector Store Reaction** (`reactions/sync-vectorstore/`)
   - Uses `Handlebars.Net` NuGet package (v2.1.6)
   - Implements template compilation with caching
   - Supports templates in QueryConfig (`documentTemplate`, `titleTemplate`)
   - Handles JSON element conversion for Handlebars
   - See: `DocumentProcessor.cs`

2. **MCP Reaction** (`reactions/mcp/`)
   - Uses `handlebars` npm package
   - Supports separate templates for `added`, `updated`, `deleted` events
   - Compiles templates on-the-fly
   - See: `src/index.ts`

### Current Dapr PubSub Implementation

**Location:** `reactions/dapr/post-pubsub/`

**Key Files:**
- `QueryConfig.cs` - Configuration model with `OutputFormat` enum (Packed/Unpacked)
- `ChangeHandler.cs` - Main handler that processes and publishes events
- `DrasiChangeFormatter.cs` - Formats changes into Drasi native format
- `IChangeFormatter.cs` - Interface for formatters
- `ChangeFormatterFactory.cs` - Factory for creating formatters

**Current Flow:**
1. `ChangeHandler.HandleChange()` receives a ChangeEvent
2. Based on `QueryConfig.Format`:
   - If Packed: Send entire ChangeEvent as JSON
   - If Unpacked: Use `DrasiChangeFormatter` to create individual messages

## Proposed Solution

### Design Approach

Follow the pattern from Sync Vector Store and MCP reactions:
1. Add Handlebars.Net NuGet package dependency
2. Extend `QueryConfig` to support template configurations
3. Create a new `TemplateChangeFormatter` class
4. Implement template compilation with caching
5. Update `ChangeFormatterFactory` to support the new formatter
6. Modify `ChangeHandler` to handle templated output

### Implementation Details

#### 1. Update Dependencies

**File:** `Drasi.Reactions.PostDaprPubSub.csproj`

Add package reference:
```xml
<PackageReference Include="Handlebars.Net" Version="2.1.6" />
```

#### 2. Extend QueryConfig

**File:** `QueryConfig.cs`

Add new properties for template support:
```csharp
/// <summary>
/// Optional: Handlebars template for formatting added results.
/// When any template is specified, format is implicitly set to Templated.
/// Available context: {{ after }}, {{ queryId }}, {{ sequence }}
/// </summary>
[JsonPropertyName("addedTemplate")]
public string? AddedTemplate { get; set; }

/// <summary>
/// Optional: Handlebars template for formatting updated results.
/// Available context: {{ before }}, {{ after }}, {{ queryId }}, {{ sequence }}
/// </summary>
[JsonPropertyName("updatedTemplate")]
public string? UpdatedTemplate { get; set; }

/// <summary>
/// Optional: Handlebars template for formatting deleted results.
/// Available context: {{ before }}, {{ queryId }}, {{ sequence }}
/// </summary>
[JsonPropertyName("deletedTemplate")]
public string? DeletedTemplate { get; set; }
```

Update the `OutputFormat` enum:
```csharp
public enum OutputFormat
{
    /// <summary>
    /// Send individual messages for each change (default).
    /// </summary>
    Unpacked = 0,
    
    /// <summary>
    /// Send the entire ChangeEvent as a single message.
    /// </summary>
    Packed = 1,
    
    /// <summary>
    /// Use Handlebars templates to format individual messages.
    /// </summary>
    Templated = 2
}
```

Add validation logic:
```csharp
public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
{
    // If any template is defined, at least one must be non-empty
    var hasTemplates = !string.IsNullOrWhiteSpace(AddedTemplate) ||
                       !string.IsNullOrWhiteSpace(UpdatedTemplate) ||
                       !string.IsNullOrWhiteSpace(DeletedTemplate);
    
    if (hasTemplates && Format == OutputFormat.Templated)
    {
        // Validation passes - templates are defined and format matches
        yield break;
    }
    else if (hasTemplates && Format != OutputFormat.Templated)
    {
        yield return new ValidationResult(
            "When templates are defined, format must be set to 'Templated'",
            new[] { nameof(Format) });
    }
    else if (!hasTemplates && Format == OutputFormat.Templated)
    {
        yield return new ValidationResult(
            "Templated format requires at least one template (addedTemplate, updatedTemplate, or deletedTemplate)",
            new[] { nameof(AddedTemplate), nameof(UpdatedTemplate), nameof(DeletedTemplate) });
    }
    
    yield break;
}
```

#### 3. Create TemplateChangeFormatter

**New File:** `Services/TemplateChangeFormatter.cs`

```csharp
using Drasi.Reaction.SDK.Models.QueryOutput;
using HandlebarsDotNet;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Drasi.Reactions.PostDaprPubSub.Services;

/// <summary>
/// Formatter that uses Handlebars templates to format change events.
/// </summary>
public class TemplateChangeFormatter : IChangeFormatter
{
    private readonly QueryConfig _config;
    private readonly ILogger<TemplateChangeFormatter> _logger;
    private readonly IHandlebars _handlebars;
    private readonly Dictionary<string, HandlebarsTemplate<object, object>> _templateCache = new();
    private readonly SemaphoreSlim _cacheUpdateLock = new(1, 1);

    public TemplateChangeFormatter(
        QueryConfig config,
        ILogger<TemplateChangeFormatter> logger)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _handlebars = Handlebars.Create();
        
        // Register JSON helper similar to MCP reaction
        _handlebars.RegisterHelper("json", (context, arguments) =>
        {
            if (arguments.Length > 0)
            {
                return JsonSerializer.Serialize(arguments[0], ModelOptions.JsonOptions);
            }
            return string.Empty;
        });
    }

    public IEnumerable<JsonElement> Format(ChangeEvent evt)
    {
        var result = new List<JsonElement>();

        // Process added results
        if (!string.IsNullOrWhiteSpace(_config.AddedTemplate))
        {
            var template = GetOrCreateTemplate(_config.AddedTemplate);
            foreach (var added in evt.AddedResults)
            {
                try
                {
                    var templateData = new
                    {
                        after = added,
                        queryId = evt.QueryId,
                        sequence = evt.Sequence
                    };
                    var processedData = ProcessResultForHandlebars(templateData);
                    var output = template(processedData);
                    result.Add(ParseJsonOutput(output));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to format added result with template");
                    throw;
                }
            }
        }

        // Process updated results
        if (!string.IsNullOrWhiteSpace(_config.UpdatedTemplate))
        {
            var template = GetOrCreateTemplate(_config.UpdatedTemplate);
            foreach (var updated in evt.UpdatedResults)
            {
                try
                {
                    var templateData = new
                    {
                        before = updated.Before,
                        after = updated.After,
                        queryId = evt.QueryId,
                        sequence = evt.Sequence
                    };
                    var processedData = ProcessResultForHandlebars(templateData);
                    var output = template(processedData);
                    result.Add(ParseJsonOutput(output));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to format updated result with template");
                    throw;
                }
            }
        }

        // Process deleted results
        if (!string.IsNullOrWhiteSpace(_config.DeletedTemplate))
        {
            var template = GetOrCreateTemplate(_config.DeletedTemplate);
            foreach (var deleted in evt.DeletedResults)
            {
                try
                {
                    var templateData = new
                    {
                        before = deleted,
                        queryId = evt.QueryId,
                        sequence = evt.Sequence
                    };
                    var processedData = ProcessResultForHandlebars(templateData);
                    var output = template(processedData);
                    result.Add(ParseJsonOutput(output));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to format deleted result with template");
                    throw;
                }
            }
        }

        return result;
    }

    private HandlebarsTemplate<object, object> GetOrCreateTemplate(string template)
    {
        if (_templateCache.TryGetValue(template, out var cachedTemplate))
        {
            return cachedTemplate;
        }

        _cacheUpdateLock.Wait();
        try
        {
            // Double-check pattern
            if (_templateCache.TryGetValue(template, out cachedTemplate))
            {
                return cachedTemplate;
            }

            var compiledTemplate = _handlebars.Compile(template);
            _templateCache[template] = compiledTemplate;
            return compiledTemplate;
        }
        finally
        {
            _cacheUpdateLock.Release();
        }
    }

    private object ProcessResultForHandlebars(object data)
    {
        // Convert to JSON and back to handle JsonElement conversion
        var json = JsonSerializer.Serialize(data, ModelOptions.JsonOptions);
        using var doc = JsonDocument.Parse(json);
        return ConvertJsonElement(doc.RootElement);
    }

    private static object ConvertJsonElement(JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.String => element.GetString()!,
            JsonValueKind.Number => element.TryGetInt32(out var intVal) ? intVal :
                                   element.TryGetInt64(out var longVal) ? longVal : element.GetDouble(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null => null!,
            JsonValueKind.Object => ConvertJsonObject(element),
            JsonValueKind.Array => ConvertJsonArray(element),
            _ => element.GetRawText()
        };
    }

    private static Dictionary<string, object?> ConvertJsonObject(JsonElement element)
    {
        var dict = new Dictionary<string, object?>();
        foreach (var prop in element.EnumerateObject())
        {
            dict[prop.Name] = ConvertJsonElement(prop.Value);
        }
        return dict;
    }

    private static List<object?> ConvertJsonArray(JsonElement element)
    {
        var list = new List<object?>();
        foreach (var item in element.EnumerateArray())
        {
            list.Add(ConvertJsonElement(item));
        }
        return list;
    }

    private JsonElement ParseJsonOutput(string output)
    {
        using var doc = JsonDocument.Parse(output);
        return doc.RootElement.Clone();
    }
}
```

#### 4. Update ChangeFormatterFactory

**File:** `Services/ChangeFormatterFactory.cs`

Update to support creating `TemplateChangeFormatter`:
```csharp
public class ChangeFormatterFactory : IChangeFormatterFactory
{
    private readonly ILogger<DrasiChangeFormatter> _drasiLogger;
    private readonly ILoggerFactory _loggerFactory;

    public ChangeFormatterFactory(
        ILogger<DrasiChangeFormatter> drasiLogger,
        ILoggerFactory loggerFactory)
    {
        _drasiLogger = drasiLogger ?? throw new ArgumentNullException(nameof(drasiLogger));
        _loggerFactory = loggerFactory ?? throw new ArgumentNullException(nameof(loggerFactory));
    }

    public IChangeFormatter GetFormatter(QueryConfig? config = null)
    {
        if (config?.Format == OutputFormat.Templated)
        {
            return new TemplateChangeFormatter(
                config,
                _loggerFactory.CreateLogger<TemplateChangeFormatter>());
        }
        
        // Default to Drasi formatter for Unpacked format
        return new DrasiChangeFormatter();
    }
}
```

Update interface:
```csharp
public interface IChangeFormatterFactory
{
    IChangeFormatter GetFormatter(QueryConfig? config = null);
}
```

#### 5. Update ChangeHandler

**File:** `Services/ChangeHandler.cs`

Modify `PublishUnpackedEvents` to accept QueryConfig:
```csharp
private async Task PublishUnpackedEvents(ChangeEvent evt, QueryConfig queryConfig)
{
    var formatter = _formatterFactory.GetFormatter(queryConfig);
    var events = formatter.Format(evt);
    
    foreach (var eventData in events)
    {
        await _daprClient.PublishEventAsync(queryConfig.PubsubName, queryConfig.TopicName, eventData);
    }
    
    _logger.LogDebug("Published {Count} events for query {QueryId}", 
        events.Count(), evt.QueryId);
}
```

Update `HandleChange` to route to templated format:
```csharp
public async Task HandleChange(ChangeEvent evt, QueryConfig? config)
{
    var queryId = evt.QueryId;
    var queryConfig = config
        ?? throw new ArgumentNullException(nameof(config), $"Query configuration is null for query {queryId}");

    _logger.LogDebug("Processing change event for query {QueryId} with pubsub {PubsubName} and topic {TopicName}",
        queryId, queryConfig.PubsubName, queryConfig.TopicName);

    if (queryConfig.Format == OutputFormat.Packed)
    {
        await PublishPackedEvent(evt, queryConfig);
    }
    else // Unpacked or Templated - both use the formatter pattern
    {
        await PublishUnpackedEvents(evt, queryConfig);
    }
}
```

#### 6. Update Documentation

**File:** `README.md`

Add template configuration documentation:
```markdown
### Templated Output Format

The reaction supports Handlebars templates to customize the output format. When using templates, set the `format` to `"Templated"` and define templates for the change types you want to handle.

#### Template Configuration

| Parameter | Description | Required | Context Variables |
|-----------|-------------|----------|-------------------|
| `addedTemplate` | Template for added results | No | `after`, `queryId`, `sequence` |
| `updatedTemplate` | Template for updated results | No | `before`, `after`, `queryId`, `sequence` |
| `deletedTemplate` | Template for deleted results | No | `before`, `queryId`, `sequence` |

#### Template Context

Templates have access to:
- `after`: The new/current state of the result
- `before`: The previous state (for updates and deletes)
- `queryId`: The ID of the query that produced the change
- `sequence`: The sequence number of the change event

#### Template Helpers

- `{{json object}}`: Serializes an object to JSON

#### Example Templated Configuration

```yaml
kind: Reaction
apiVersion: v1
name: templated-pubsub
spec:
  kind: PostDaprPubSub
  queries:
    inventory-changes: |
      {
        "pubsubName": "drasi-pubsub",
        "topicName": "inventory-events",
        "format": "Templated",
        "addedTemplate": "{\"type\": \"inventory_added\", \"product\": \"{{after.productName}}\", \"quantity\": {{after.quantity}}, \"queryId\": \"{{queryId}}\"}",
        "updatedTemplate": "{\"type\": \"inventory_updated\", \"product\": \"{{after.productName}}\", \"oldQty\": {{before.quantity}}, \"newQty\": {{after.quantity}}}",
        "deletedTemplate": "{\"type\": \"inventory_removed\", \"product\": \"{{before.productName}}\"}"
      }
    
    order-notifications: |
      {
        "pubsubName": "messaging",
        "topicName": "orders",
        "format": "Templated",
        "addedTemplate": "{\"eventType\": \"ORDER_CREATED\", \"orderId\": \"{{after.orderId}}\", \"customer\": \"{{after.customerName}}\", \"total\": {{after.totalAmount}}, \"items\": {{json after.items}}}"
      }
```

#### Complex Template Example

For more complex scenarios, you can use Handlebars conditionals and loops:

```json
{
  "pubsubName": "drasi-pubsub",
  "topicName": "customer-events",
  "format": "Templated",
  "addedTemplate": "{\"event\": \"CUSTOMER_ADDED\", \"customer\": {\"id\": \"{{after.customerId}}\", \"name\": \"{{after.name}}\", \"premium\": {{#if after.isPremium}}true{{else}}false{{/if}}}}",
  "updatedTemplate": "{\"event\": \"CUSTOMER_UPDATED\", \"customerId\": \"{{after.customerId}}\", \"changes\": {\"name\": {\"from\": \"{{before.name}}\", \"to\": \"{{after.name}}\"}}}",
  "deletedTemplate": "{\"event\": \"CUSTOMER_DELETED\", \"customerId\": \"{{before.customerId}}\"}"
}
```
```

#### 7. Add Unit Tests

**File:** `Drasi.Reactions.PostDaprPubSub.Tests/Services/TemplateChangeFormatterTests.cs`

Create comprehensive tests covering:
- Template compilation and caching
- Formatting added results
- Formatting updated results
- Formatting deleted results
- JSON helper function
- Error handling for invalid templates
- Context variable access (after, before, queryId, sequence)

**File:** `Drasi.Reactions.PostDaprPubSub.Tests/QueryConfigTests.cs`

Add validation tests:
- Valid templated configurations
- Invalid: templates without Templated format
- Invalid: Templated format without templates
- Templates with special characters and JSON

## Testing Strategy

### Unit Tests
1. `TemplateChangeFormatter` tests for all template types
2. Template caching validation
3. JSON helper function tests
4. Error handling tests
5. QueryConfig validation tests

### Integration Tests
1. End-to-end test with templated output
2. Verify messages are correctly formatted and published
3. Test with various template complexities

### Manual Testing
1. Deploy reaction with templated configuration
2. Trigger changes through a test query
3. Verify published messages match template expectations
4. Test all three template types (added, updated, deleted)

## Migration Path

This is a **non-breaking change**:
- Existing configurations continue to work with Packed/Unpacked formats
- Templated format is opt-in via configuration
- Default behavior unchanged (Unpacked)

Users can migrate incrementally:
1. Keep existing configuration
2. Add template properties when ready
3. Set format to "Templated"
4. Test and validate output

## Benefits

1. **Flexibility**: Users can customize message format to match their downstream systems
2. **Consistency**: Aligns with template support in other Drasi reactions
3. **Backward Compatible**: Existing configurations continue to work
4. **Powerful**: Handlebars supports conditionals, loops, and custom helpers
5. **Efficient**: Template compilation with caching ensures good performance

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Complex templates may impact performance | Implement template caching, document best practices |
| Invalid templates cause runtime errors | Validate templates at startup, provide clear error messages |
| Template syntax learning curve | Provide comprehensive examples in documentation |
| Breaking changes to existing behavior | Make templated format opt-in, maintain backward compatibility |

## Implementation Checklist

- [ ] Add Handlebars.Net NuGet package
- [ ] Update QueryConfig with template properties and validation
- [ ] Create TemplateChangeFormatter class
- [ ] Update ChangeFormatterFactory to support templates
- [ ] Modify ChangeHandler to route templated events
- [ ] Update README with template documentation and examples
- [ ] Create unit tests for TemplateChangeFormatter
- [ ] Add QueryConfig validation tests
- [ ] Create integration tests
- [ ] Manual testing with sample configurations
- [ ] Update reaction-provider.yaml if needed
- [ ] Add example configurations to reaction.yaml or docs

## Timeline Estimate

- Implementation: 4-6 hours
- Testing: 2-3 hours
- Documentation: 1-2 hours
- Review and refinement: 1-2 hours

**Total: 8-13 hours**

## References

- Issue: https://github.com/drasi-project/drasi-platform/issues/345
- Handlebars.Net: https://github.com/Handlebars-Net/Handlebars.Net
- Sync Vector Store implementation: `reactions/sync-vectorstore/Drasi.Reactions.SyncVectorStore/Services/DocumentProcessor.cs`
- MCP Reaction implementation: `reactions/mcp/src/index.ts`
