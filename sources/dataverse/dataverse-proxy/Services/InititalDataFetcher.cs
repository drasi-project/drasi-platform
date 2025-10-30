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


using System.Runtime.CompilerServices;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using Proxy.Models;

namespace Proxy.Services
{
    class InititalDataFetcher(IEventMapper eventMapper, IOrganizationServiceAsync serviceClient) : IInititalDataFetcher
    {
        private readonly IEventMapper _eventMapper = eventMapper;
        private readonly IOrganizationServiceAsync _serviceClient = serviceClient;

        public async IAsyncEnumerable<VertexState> GetBootstrapData(string entityName, [EnumeratorCancellation]CancellationToken stoppingToken)
        {
            Console.WriteLine($"[InititalDataFetcher] Starting bootstrap for table: {entityName}");

            RetrieveEntityChangesRequest req = new RetrieveEntityChangesRequest()
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

            Console.WriteLine($"[InititalDataFetcher] Executing RetrieveEntityChangesRequest for {entityName}...");
            RetrieveEntityChangesResponse resp = (RetrieveEntityChangesResponse)_serviceClient.Execute(req);
            Console.WriteLine($"[InititalDataFetcher] Retrieved {resp.EntityChanges.Changes.Count} changes for {entityName}");

            var moreData = true;
            var totalRecords = 0;
            var pageNumber = 1;

            while (moreData)
            {
                Console.WriteLine($"[InititalDataFetcher] Processing page {pageNumber} with {resp.EntityChanges.Changes.Count} changes");

                foreach (var change in resp.EntityChanges.Changes)
                {
                    totalRecords++;

                    // Log first 3 records with details
                    if (totalRecords <= 3)
                    {
                        Console.WriteLine($"[InititalDataFetcher] Record #{totalRecords}: Type={change.GetType().Name}");
                        if (change is NewOrUpdatedItem newOrUpdated)
                        {
                            Console.WriteLine($"[InititalDataFetcher]   - Entity: {newOrUpdated.NewOrUpdatedEntity.LogicalName}");
                            Console.WriteLine($"[InititalDataFetcher]   - ID: {newOrUpdated.NewOrUpdatedEntity.Id}");
                            Console.WriteLine($"[InititalDataFetcher]   - All Attributes ({newOrUpdated.NewOrUpdatedEntity.Attributes.Count}):");
                            foreach (var attr in newOrUpdated.NewOrUpdatedEntity.Attributes)
                            {
                                // TODO: Handle EntityReference, OptionSetValue, Money types with proper formatting
                                // e.g., EntityReference should show Id, Name, and LogicalName
                                var value = attr.Value?.ToString() ?? "null";
                                // Truncate long values
                                if (value.Length > 100)
                                    value = value.Substring(0, 100) + "...";
                                Console.WriteLine($"[InititalDataFetcher]     • {attr.Key} = {value}");
                            }
                        }
                    }

                    var vtx = await _eventMapper.MapEventAsync(change);
                    yield return vtx;
                }

                moreData = resp.EntityChanges.MoreRecords;
                Console.WriteLine($"[InititalDataFetcher] Page {pageNumber} complete. More data: {moreData}");

                if (moreData)
                {
                    pageNumber++;
                    Console.WriteLine($"[InititalDataFetcher] Fetching page {pageNumber}...");
                    resp = (RetrieveEntityChangesResponse)_serviceClient.Execute(new RetrieveEntityChangesRequest()
                    {
                        EntityName = entityName,
                        Columns = new ColumnSet(true),
                        PageInfo = new PagingInfo()
                        {
                            PagingCookie = resp.EntityChanges.PagingCookie,
                            Count = 200
                        }
                    });
                    Console.WriteLine($"[InititalDataFetcher] Retrieved {resp.EntityChanges.Changes.Count} changes for page {pageNumber}");
                }
            }

            Console.WriteLine($"[InititalDataFetcher] Bootstrap complete for {entityName}. Total records processed: {totalRecords}");
        }
    }
}