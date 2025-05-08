using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;

/// <summary>
/// Handles control signals for query lifecycle management.
/// Triggers initial full sync when a query enters the 'BootstrapCompleted' state.
/// </summary>
public class ControlSignalHandler : IControlEventHandler<QueryConfig>
{
    private readonly IDaprSyncService _daprSyncService;
    private readonly IQuerySyncStateManager _stateManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ControlSignalHandler> _logger;

    public ControlSignalHandler(
        IDaprSyncService daprSyncService,
        IQuerySyncStateManager stateManager,
        IConfiguration configuration,
        ILogger<ControlSignalHandler> logger)
    {
        _daprSyncService = daprSyncService;
        _stateManager = stateManager;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task HandleControlSignal(ControlEvent evt, QueryConfig? queryConfig)
    {
        if (queryConfig == null)
        {
            _logger.LogError("Received control signal for query {QueryId} but query configuration is null. Cannot process.", evt.QueryId);
            return;
        }

        string? stateStoreName = _configuration["stateStoreName"];
        if (string.IsNullOrEmpty(stateStoreName))
        {
            _logger.LogError("Dapr state store name ('stateStoreName') is not configured. Cannot process control signal for query {QueryId}.", evt.QueryId);
            return;
        }

        // Trigger full sync only on the 'BootstrapCompleted' signal
        if (evt.ControlSignal?.Kind == ControlSignalKind.BootstrapCompleted)
        {
            _logger.LogDebug("Received 'BootstrapCompleted' signal for query {QueryId} at sequence {Sequence}.", evt.QueryId, evt.Sequence);

            // Check if already initialized by a newer sequence
            bool previouslyInitialized = _stateManager.IsInitialized(evt.QueryId, out long initializationSequence);
            if (previouslyInitialized && evt.Sequence <= initializationSequence)
            {
                _logger.LogInformation("Query {QueryId} already initialized at sequence {InitSequence}. Ignoring older bootstrap signal at sequence {Sequence}.", 
                    evt.QueryId, initializationSequence, evt.Sequence);
                return;
            }

            if (previouslyInitialized)
            {
                _logger.LogInformation("Query {QueryId} previously initialized at sequence {InitSequence}, but received newer bootstrap at sequence {Sequence}. Performing full sync.", 
                    evt.QueryId, initializationSequence, evt.Sequence);
                _stateManager.ResetState(evt.QueryId);
            }
            else
            {
                _logger.LogInformation("Query {QueryId} initializing for the first time at sequence {Sequence}.", evt.QueryId, evt.Sequence);
            }

            try
            {
                await _daprSyncService.PerformFullSyncAsync(evt.QueryId, queryConfig, stateStoreName);
                _stateManager.TryMarkInitialized(evt.QueryId, evt.Sequence);
                _logger.LogInformation("Successfully completed full sync for query {QueryId} at sequence {Sequence}.", evt.QueryId, evt.Sequence);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to perform full sync for query {QueryId}: {ErrorMessage}", evt.QueryId, ex.Message);
                _stateManager.ResetState(evt.QueryId);

            }
        }
        else
        {
            _logger.LogDebug("Received '{SignalKind}' signal for query {QueryId}. Resetting synchronization state.", evt.ControlSignal?.Kind, evt.QueryId);
            _stateManager.ResetState(evt.QueryId);
        }
    }
}