// Copyright 2025 The Drasi Authors.
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

using Dapr;
using Dapr.Client;
using Drasi.Reaction.SDK.Models.ViewService;
using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;

public interface IQueryInitializationService
{
    public Task InitializeQueriesAsync(CancellationToken cancellationToken);
}

public class QueryInitializationService : IQueryInitializationService
{
    private readonly ILogger<QueryInitializationService> _logger;
    private readonly IExtendedManagementClient _managementClient;
    private readonly IQueryConfigService _queryConfigService;
    private readonly IResultViewClient _resultViewClient;
    private readonly IQuerySyncPointManager _querySyncPointManager;
    private readonly DaprClient _daprClient;
    private readonly IErrorStateHandler _errorStateHandler;

    public const string DaprConnectivityTestKeyFormatString = "_drasi_reaction_ping_check_{0}_{1}";
    public const int DefaultWaitForQueryReadySeconds = 300; // 5 minutes

    public QueryInitializationService(
        ILogger<QueryInitializationService> logger,
        IExtendedManagementClient managementClient,
        IQueryConfigService queryConfigService,
        IResultViewClient resultViewClient,
        IQuerySyncPointManager querySyncPointManager,
        DaprClient daprClient,
        IErrorStateHandler errorStateHandler)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _managementClient = managementClient ?? throw new ArgumentNullException(nameof(managementClient));
        _queryConfigService = queryConfigService ?? throw new ArgumentNullException(nameof(queryConfigService));
        _resultViewClient = resultViewClient ?? throw new ArgumentNullException(nameof(resultViewClient));
        _querySyncPointManager = querySyncPointManager ?? throw new ArgumentNullException(nameof(querySyncPointManager));
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _errorStateHandler = errorStateHandler ?? throw new ArgumentNullException(nameof(errorStateHandler));
    }
    
    public async Task InitializeQueriesAsync(CancellationToken cancellationToken)
    {
        _logger.LogDebug("Initializing the queries...");
        await WaitForDaprSideCarAsync(cancellationToken);

        var queryNames = _queryConfigService.GetQueryNames();
        if (queryNames.Count == 0)
        {
            _logger.LogWarning("No Queries configured.");
            return;
        }

        foreach (var queryName in queryNames)
        {
            if (cancellationToken.IsCancellationRequested) break;

            var queryConfig = _queryConfigService.GetQueryConfig<QueryConfig>(queryName);
            if (queryConfig == null)
            {
                _logger.LogError("Query configuration is null for query {QueryName}.", queryName);
                continue;
            }

            var stateStoreName = queryConfig.StateStoreName;
            var keyFieldName = queryConfig.KeyField;

            await ValidateDaprStateStoreConnectivityAsync(stateStoreName, queryName, cancellationToken);

            if (await _querySyncPointManager.TryLoadSyncPointAsync(queryName, stateStoreName, cancellationToken))
            {
                _logger.LogInformation("Sync point for query {QueryName} was loaded from Dapr state store.", queryName);
            }
            else
            {
                _logger.LogDebug("Start point for query {QueryName} was not found. Starting full sync...", queryName);

                long querySyncPoint = -1;                
                if (await _managementClient.WaitForQueryReadyAsync(queryName, DefaultWaitForQueryReadySeconds, cancellationToken))
                {
                    querySyncPoint = await PerformInitialSyncForQueryAsync(queryName, stateStoreName, keyFieldName, cancellationToken);
                }
                else
                {
                    var errorMessage = $"Query {queryName} did not become ready within the timeout period.";
                    _logger.LogError(errorMessage);
                    _errorStateHandler.Terminate(errorMessage);
                    throw new InvalidProgramException(errorMessage);
                }

                if (await _querySyncPointManager.TryUpdateSyncPointAsync(queryName, stateStoreName, querySyncPoint, cancellationToken))
                {
                    _logger.LogInformation("Sync point for query {QueryName} was updated to {SequenceNumber} in Dapr state store.",
                        queryName, querySyncPoint);
                }
                else
                {
                    var errorMessage = $"Failed to update sync point for query {queryName} in Dapr state store.";
                    _logger.LogError(errorMessage);
                    _errorStateHandler.Terminate(errorMessage);
                    throw new InvalidProgramException(errorMessage);
                }
            }
        }
    }

    private async Task ValidateDaprStateStoreConnectivityAsync(string stateStoreName, string queryName, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(stateStoreName))
        {
            var errorMessage = $"StateStoreName is not configured for query {queryName}.";
            _errorStateHandler.Terminate(errorMessage);
            throw new InvalidProgramException(errorMessage);
        }

        try
        {
            var testKey = string.Format(DaprConnectivityTestKeyFormatString, queryName, Guid.NewGuid());
            _logger.LogDebug("Checking Dapr state store {StateStoreName} connectivity for query {QueryName} with test key {TestKey}...", 
                stateStoreName, queryName, testKey);
            await _daprClient.GetStateAsync<object>(stateStoreName, testKey, cancellationToken: cancellationToken);
        }
        catch (DaprApiException ex)
        {
            var errorMessage = $"Dapr API error while trying to connect to state store {stateStoreName} for query {queryName}.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
        catch (Exception ex)
        {
            var errorMessage = $"Error while trying to connect to Dapr state store {stateStoreName} for query {queryName}.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }

        _logger.LogInformation("Successfully able to connect to Dapr state store {StateStoreName} for query {QueryName}.", 
            stateStoreName, queryName);
    }

    private async Task WaitForDaprSideCarAsync(CancellationToken stoppingToken)
    {
        _logger.LogDebug("Waiting for Dapr sidecar to be available...");
        try
        {
            await _daprClient.WaitForSidecarAsync(stoppingToken);
            _logger.LogInformation("Dapr sidecar is available.");
        }
        catch (DaprException ex)
        {
            var errorMessage = "Dapr sidecar is not available.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
        catch (Exception ex)
        {
            var errorMessage = "Unexpected error while waiting for Dapr sidecar.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
    }

    private async Task<long> GetQuerySyncPointFromHeaderAsync(IAsyncEnumerator<ViewItem> streamEnumerator, string queryName)
    {
        try
        {
            if (await streamEnumerator.MoveNextAsync())
            {
                var firstItem = streamEnumerator.Current;
                if (firstItem?.Header == null)
                {
                    var errorMessage = $"Header in result stream is null for query {queryName}. Aborting initial sync.";
                    _logger.LogError(errorMessage);
                    _errorStateHandler.Terminate(errorMessage);
                    throw new InvalidProgramException(errorMessage);
                }

                return firstItem.Header.Sequence;
            }
            else
            {
                var errorMessage = $"No header returned in result stream for query {queryName}. Aborting initial sync.";
                _logger.LogError(errorMessage);
                _errorStateHandler.Terminate(errorMessage);
                throw new InvalidProgramException(errorMessage);
            }
        }
        catch (Exception ex)
        {
            var errorMessage = $"Unexpected error while fetching result stream header for query {queryName}.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
    }

    private async Task<List<SaveStateItem<Dictionary<string, object>>>> BuildListOfItemsToSaveAsync(
        IAsyncEnumerator<ViewItem> streamEnumerator, 
        string queryName, 
        string keyFieldName, 
        CancellationToken cancellationToken)
    {
        List<SaveStateItem<Dictionary<string, object>>> itemsToSave = new();
        try
        {
            while (await streamEnumerator.MoveNextAsync())
            {
                if (cancellationToken.IsCancellationRequested) return itemsToSave;

                var viewItem = streamEnumerator.Current;
                if (viewItem?.Data == null) continue;

                // Create SaveStateItem without ETag for overwrite
                var itemKey = viewItem.Data[keyFieldName]?.ToString();
                itemsToSave.Add(new SaveStateItem<Dictionary<string, object>>(itemKey, viewItem.Data, etag: null));
                
                _logger.LogDebug("Prepared item with key {ItemKey} for saving to Dapr state store for query {QueryName}.",
                    itemKey, queryName);
            }

            return itemsToSave;
        }
        catch (Exception ex)
        {
            var errorMessage = $"Unexpected error while parsing result stream for query {queryName}.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
    }

    private async Task<long> PerformInitialSyncForQueryAsync(
        string queryName, 
        string stateStoreName, 
        string keyFieldName, 
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Fetching initial data for query {QueryId} from ResultViewClient...", queryName);
        
        long querySyncPoint = -1;
        var stream = _resultViewClient.GetCurrentResult(queryName, cancellationToken);
        var saveStateItems = new List<SaveStateItem<Dictionary<string, object>>>();
        
        await using (var streamEnumerator = stream.GetAsyncEnumerator(cancellationToken))
        {
            querySyncPoint = await GetQuerySyncPointFromHeaderAsync(streamEnumerator, queryName);
            saveStateItems = await BuildListOfItemsToSaveAsync(streamEnumerator, queryName, keyFieldName, cancellationToken);
        }

        if (saveStateItems.Count > 0)
        {
            try
            {
                _logger.LogDebug("Attempting to save {Count} items in bulk to Dapr store '{StateStoreName}' for query {QueryId}",
                    saveStateItems.Count, stateStoreName, queryName);

                await _daprClient.SaveBulkStateAsync(stateStoreName, saveStateItems);

                _logger.LogDebug("Successfully saved {Count} items to Dapr store '{StateStoreName}' for query {QueryId}",
                    saveStateItems.Count, stateStoreName, queryName);
            }
            catch (DaprApiException ex)
            {
                var errorMessage = $"Dapr API error while saving result data to state store {stateStoreName} for query {queryName}.";
                _logger.LogError(ex, errorMessage);
                _errorStateHandler.Terminate(errorMessage);
                throw;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Unexpected Error while saving result data to Dapr state store {stateStoreName} for query {queryName}.";
                _logger.LogError(ex, errorMessage);
                _errorStateHandler.Terminate(errorMessage);
                throw;
            }
        }

        _logger.LogDebug("Successfully saved initial result set for query {QueryId} to Dapr state store {StateStoreName}.",
            queryName, stateStoreName);
        
        return querySyncPoint;
    }
}