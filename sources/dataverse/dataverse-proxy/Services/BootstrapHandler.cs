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


using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;
using System.Runtime.CompilerServices;
using Azure.Identity;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DataverseProxy.Services
{
    class BootstrapHandler(IEventMapper eventMapper, IConfiguration configuration, ILogger<BootstrapHandler> logger) : IBootstrapHandler
    {
        public async IAsyncEnumerable<SourceElement> Bootstrap(BootstrapRequest request, [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            logger.LogInformation("Starting bootstrap process");

            var dataverseUri = configuration.GetValue<string>("dataverseUri");
            var managedIdentityClientId = configuration.GetValue<string?>("managedIdentityClientId");

            if (string.IsNullOrEmpty(dataverseUri))
            {
                logger.LogWarning("No dataverseUri configured, skipping bootstrap");
                yield break;
            }

            var serviceClient = BuildClient(dataverseUri, managedIdentityClientId);

            foreach (var label in request.NodeLabels)
            {
                logger.LogInformation("Bootstrapping entity: {EntityName}", label);

                await foreach (var element in GetEntityData(serviceClient, label, eventMapper, cancellationToken))
                {
                    yield return element;
                }
            }

            logger.LogInformation("Bootstrap process completed");
        }

        private async IAsyncEnumerable<SourceElement> GetEntityData(
            ServiceClient serviceClient,
            string entityName,
            IEventMapper eventMapper,
            [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            logger.LogInformation("Starting bootstrap for table: {EntityName}", entityName);

            var req = new RetrieveEntityChangesRequest()
            {
                EntityName = entityName,
                Columns = new ColumnSet(true),
                PageInfo = new PagingInfo()
                {
                    Count = 200,
                    PageNumber = 1,
                    ReturnTotalRecordCount = false
                }
            };

            logger.LogInformation("Executing RetrieveEntityChangesRequest for {EntityName}", entityName);
            var resp = (RetrieveEntityChangesResponse)await serviceClient.ExecuteAsync(req, cancellationToken);
            logger.LogInformation("Retrieved {Count} changes for {EntityName}", resp.EntityChanges.Changes.Count, entityName);

            var moreData = true;
            var totalRecords = 0;
            var pageNumber = 1;

            while (moreData)
            {
                logger.LogInformation("Processing page {PageNumber} with {Count} changes", pageNumber, resp.EntityChanges.Changes.Count);

                foreach (var change in resp.EntityChanges.Changes)
                {
                    totalRecords++;

                    // Log first 3 records with details
                    if (totalRecords <= 3)
                    {
                        logger.LogInformation("Record #{RecordNumber}: Type={ChangeType}", totalRecords, change.GetType().Name);
                        if (change is NewOrUpdatedItem newOrUpdated)
                        {
                            logger.LogInformation("  - Entity: {EntityName}, ID: {EntityId}, AttributeCount: {AttributeCount}",
                                newOrUpdated.NewOrUpdatedEntity.LogicalName,
                                newOrUpdated.NewOrUpdatedEntity.Id,
                                newOrUpdated.NewOrUpdatedEntity.Attributes.Count);
                        }
                    }

                    var element = await eventMapper.MapEventAsync(change);
                    yield return element;
                }

                moreData = resp.EntityChanges.MoreRecords;
                logger.LogInformation("Page {PageNumber} complete. More data: {MoreData}", pageNumber, moreData);

                if (moreData)
                {
                    pageNumber++;
                    logger.LogInformation("Fetching page {PageNumber}...", pageNumber);
                    resp = (RetrieveEntityChangesResponse)await serviceClient.ExecuteAsync(new RetrieveEntityChangesRequest()
                    {
                        EntityName = entityName,
                        Columns = new ColumnSet(true),
                        PageInfo = new PagingInfo()
                        {
                            PagingCookie = resp.EntityChanges.PagingCookie,
                            Count = 200
                        }
                    }, cancellationToken);
                    logger.LogInformation("Retrieved {Count} changes for page {PageNumber}", resp.EntityChanges.Changes.Count, pageNumber);
                }
            }

            logger.LogInformation("Bootstrap complete for {EntityName}. Total records processed: {TotalRecords}", entityName, totalRecords);
        }

        private ServiceClient BuildClient(string dataverseUri, string? managedIdentityClientId = null)
        {
            var uri = new Uri(dataverseUri);
            var dataverseScope = $"{uri.Scheme}://{uri.Host}/.default";
            DefaultAzureCredential credential;

            switch (configuration.GetIdentityType())
            {
                case IdentityType.MicrosoftEntraWorkloadID:
                    logger.LogInformation("Using Microsoft Entra Workload ID");
                    credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
                    {
                        ManagedIdentityClientId = managedIdentityClientId
                    });
                    break;
                default:
                // TODO: support more identity types
                    logger.LogInformation("Using default Azure credential");
                    credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
                    {
                        ManagedIdentityClientId = managedIdentityClientId
                    });
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
    }
}

