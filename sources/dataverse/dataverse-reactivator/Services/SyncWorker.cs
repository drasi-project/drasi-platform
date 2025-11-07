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

using System.Threading.Channels;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;
using Azure.Identity;

namespace DataverseReactivator.Services
{
    class SyncWorker : BackgroundService
    {
        private const int MinIntervalMs = 500; // Start at 0.5 seconds
        private const int ThresholdMs = 5000; // 5 seconds - switch from slow to fast backoff
        private const double SlowBackoffMultiplier = 1.2; // Slow increase under threshold
        private const double FastBackoffMultiplier = 1.5; // Fast increase above threshold
        private readonly Channel<SourceChange> _channel;
        private readonly IStateStore _stateStore;
        private readonly IEventMapper _eventMapper;
        private readonly IConfiguration _configuration;
        private readonly ServiceClient _serviceClient;
        private readonly string _entityName;
        private readonly int _maxIntervalSeconds;
        private readonly ILogger _logger;

        private int _currentIntervalMs;


        public SyncWorker(
            Channel<SourceChange> channel,
            IStateStore stateStore,
            IEventMapper eventMapper,
            IConfiguration configuration,
            ILogger logger,
            string entityName,
            int maxIntervalSeconds)
        {
            _channel = channel;
            _stateStore = stateStore;
            _eventMapper = eventMapper;
            _configuration = configuration;
            _entityName = entityName;
            _maxIntervalSeconds = maxIntervalSeconds;
            _logger = logger;
            _serviceClient = BuildClient(configuration, logger);
            _currentIntervalMs = MinIntervalMs; // Start with 500ms interval
        }

        internal static ServiceClient BuildClient(IConfiguration configuration, ILogger logger)
        {
            var dataverseUri = configuration.GetValue<string>("endpoint");
            var managedIdentityClientId = configuration.GetValue<string>("host");
            if (string.IsNullOrEmpty(dataverseUri))
            {
                throw new InvalidOperationException("dataverseUri configuration is required");
            }

            var uri = new Uri(dataverseUri);
            var dataverseScope = $"{uri.Scheme}://{uri.Host}/.default";

            Azure.Core.TokenCredential credential;

            switch (configuration.GetIdentityType())
            {
                case IdentityType.MicrosoftEntraWorkloadID:
                    logger.LogInformation("Using Microsoft Entra Workload ID");
                    credential = new DefaultAzureCredential();
                    break;
                default:
                    // Check if client secret credentials are provided for Azure Entra App Registration
                    var tenantId = configuration.GetValue<string>("tenantId");
                    var clientId = configuration.GetValue<string>("clientId");
                    var clientSecret = configuration.GetValue<string>("clientSecret");

                    if (!string.IsNullOrEmpty(tenantId) && !string.IsNullOrEmpty(clientId) && !string.IsNullOrEmpty(clientSecret))
                    {
                        logger.LogInformation("Using Azure Entra Application Registration with Client Secret (tenantId: {TenantId}, clientId: {ClientId})", tenantId, clientId);
                        credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
                    }
                    else
                    {
                        logger.LogInformation("Using DefaultAzureCredential with optional managed identity");
                        credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
                        {
                            ManagedIdentityClientId = managedIdentityClientId
                        });
                    }
                    break;
            }

            var serviceClient = new ServiceClient(
                uri,
                async (string instanceUri) =>
                {
                    var token = await credential.GetTokenAsync(
                        new Azure.Core.TokenRequestContext(new[] { dataverseScope }),
                        default);
                    return token.Token;
                },
                useUniqueInstance: false,
                logger: null);

            return serviceClient;
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation($"Starting SyncWorker for entity: {_entityName}");

            // Get last delta token from state store
            var lastTokenBytes = await _stateStore.Get($"{_entityName}-deltatoken");
            string? lastToken = lastTokenBytes != null ? System.Text.Encoding.UTF8.GetString(lastTokenBytes) : null;

            if (string.IsNullOrEmpty(lastToken))
            {
                _logger.LogInformation($"No checkpoint found for {_entityName}, getting current delta token");
                lastToken = await GetCurrentDeltaToken(stoppingToken);
            }
            else
            {
                _logger.LogInformation($"Resuming from checkpoint for {_entityName}");
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation($"Polling for changes in entity: {_entityName} (interval: {_currentIntervalMs}ms)");
                    var (changes, newToken) = await GetChanges(lastToken, stoppingToken);

                    long reactivatorStartNs = (DateTimeOffset.UtcNow.Ticks - DateTimeOffset.UnixEpoch.Ticks) * 100;
                    _logger.LogInformation($"Got {changes.Count} changes for entity {_entityName}");

                    if (changes.Count > 0)
                    {
                        // Changes detected - reset to minimum interval for responsive polling
                        _currentIntervalMs = MinIntervalMs;

                        foreach (var change in changes)
                        {
                            var sourceChange = await _eventMapper.MapEventAsync(change, reactivatorStartNs);
                            await _channel.Writer.WriteAsync(sourceChange, stoppingToken);
                            _logger.LogInformation($"Published change for entity {_entityName}");
                        }

                        // Save the new delta token before continuing
                        await _stateStore.Put($"{_entityName}-deltatoken", System.Text.Encoding.UTF8.GetBytes(newToken));
                        lastToken = newToken;

                        // Skip delay to poll immediately after processing changes
                        continue;
                    }
                    else
                    {
                        // No changes - two-phase multiplicative backoff
                        int previousInterval = _currentIntervalMs;

                        // Use slow backoff under threshold, fast backoff above threshold
                        double multiplier = _currentIntervalMs < ThresholdMs
                            ? SlowBackoffMultiplier
                            : FastBackoffMultiplier;

                        _currentIntervalMs = Math.Min(
                            (int)(_currentIntervalMs * multiplier),
                            _maxIntervalSeconds * 1000
                        );

                    }

                    await _stateStore.Put($"{_entityName}-deltatoken", System.Text.Encoding.UTF8.GetBytes(newToken));
                    lastToken = newToken;

                    await Task.Delay(_currentIntervalMs, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    _logger.LogInformation($"Shutting down SyncWorker for entity: {_entityName}");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error syncing entity {_entityName}: {ex.Message} {ex.InnerException?.Message}");
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }

        private async Task<(BusinessEntityChangesCollection, string)> GetChanges(string deltaToken, CancellationToken cancellationToken)
        {
            var result = new BusinessEntityChangesCollection();

            RetrieveEntityChangesRequest req = new RetrieveEntityChangesRequest()
            {
                EntityName = _entityName,
                Columns = new ColumnSet(true),
                DataVersion = deltaToken,
                PageInfo = new PagingInfo()
                {
                    Count = 1000,
                    PageNumber = 1,
                    ReturnTotalRecordCount = false
                }
            };

            RetrieveEntityChangesResponse resp = (RetrieveEntityChangesResponse)await _serviceClient.ExecuteAsync(req, cancellationToken);
            var moreData = true;

            while (moreData)
            {
                result.AddRange(resp.EntityChanges.Changes);
                moreData = resp.EntityChanges.MoreRecords;

                if (moreData)
                {
                    resp = (RetrieveEntityChangesResponse)await _serviceClient.ExecuteAsync(new RetrieveEntityChangesRequest()
                    {
                        EntityName = _entityName,
                        Columns = new ColumnSet(true),
                        DataVersion = deltaToken,
                        PageInfo = new PagingInfo()
                        {
                            PagingCookie = resp.EntityChanges.PagingCookie,
                            Count = 1000
                        }
                    }, cancellationToken);
                }
            }

            return (result, resp.EntityChanges.DataToken);
        }

        private async Task<string> GetCurrentDeltaToken(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Getting initial delta token for entity: {_entityName}");

            RetrieveEntityChangesRequest req = new RetrieveEntityChangesRequest()
            {
                EntityName = _entityName,
                Columns = new ColumnSet(true),
                PageInfo = new PagingInfo()
                {
                    Count = 1000,
                    PageNumber = 1,
                    ReturnTotalRecordCount = false
                }
            };

            RetrieveEntityChangesResponse resp = (RetrieveEntityChangesResponse)await _serviceClient.ExecuteAsync(req, cancellationToken);
            var moreData = true;

            // Page through all data to get to the end and get the latest token
            while (moreData)
            {
                moreData = resp.EntityChanges.MoreRecords;
                if (moreData)
                {
                    resp = (RetrieveEntityChangesResponse)await _serviceClient.ExecuteAsync(new RetrieveEntityChangesRequest()
                    {
                        EntityName = _entityName,
                        Columns = new ColumnSet(true),
                        PageInfo = new PagingInfo()
                        {
                            PagingCookie = resp.EntityChanges.PagingCookie,
                            Count = 1000
                        }
                    }, cancellationToken);
                }
            }

            _logger.LogInformation($"Initial delta token obtained for entity: {_entityName}");
            return resp.EntityChanges.DataToken;
        }
    }
}