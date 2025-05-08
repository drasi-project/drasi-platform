using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;

/// <summary>
/// Handles incremental change events from Drasi queries.
/// Applies changes to the Dapr state store only after the initial full sync 
/// has completed and if the event sequence is newer.
/// </summary>
public class ChangeEventHandler : IChangeEventHandler<QueryConfig>
{
    private readonly IDaprSyncService _daprSyncService;
    private readonly IQuerySyncStateManager _stateManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ChangeEventHandler> _logger;

    public ChangeEventHandler(
        IDaprSyncService daprSyncService,
        IQuerySyncStateManager stateManager,
        IConfiguration configuration,
        ILogger<ChangeEventHandler> logger)
    {
        _daprSyncService = daprSyncService;
        _stateManager = stateManager;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? queryConfig)
    {
        if (queryConfig == null)
        {
            _logger.LogError("Received change for query {QueryId} but query configuration is null. Cannot process.", evt.QueryId);
            return;
        }

        string? stateStoreName = _configuration["stateStoreName"];
        if (string.IsNullOrEmpty(stateStoreName))
        {
            _logger.LogError("Dapr state store name ('stateStoreName') is not configured. Cannot process change for query {QueryId}.", evt.QueryId);
            return;
        }

        // Only process changes after the query has been initialized
        if (!_stateManager.IsInitialized(evt.QueryId, out long initializationSequence))
        {
            _logger.LogDebug("Change event received for query {QueryId} at sequence {Sequence}, but query is not yet initialized. Skipping.", 
                evt.QueryId, evt.Sequence);
            return;
        }

        // Skip events that occurred before or at initialization
        if (evt.Sequence <= initializationSequence)
        {
            _logger.LogDebug("Change event for query {QueryId} has sequence {Sequence} <= initialization sequence {InitSequence}. Skipping.", 
                evt.QueryId, evt.Sequence, initializationSequence);
            return;
        }

        try
        {
        
            _logger.LogDebug("Processing change event for query {QueryId} (sequence {Sequence}) in Dapr state store '{StateStoreName}'.",
                evt.QueryId, evt.Sequence, stateStoreName);
            
            await _daprSyncService.ProcessChangeAsync(evt.QueryId, queryConfig, stateStoreName, evt);
            
            _logger.LogDebug("Successfully processed change event for query {QueryId} at sequence {Sequence}",
                evt.QueryId, evt.Sequence);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process change event for query {QueryId} at sequence {Sequence}: {ErrorMessage}",
                evt.QueryId, evt.Sequence, ex.Message);
        }
    }
}