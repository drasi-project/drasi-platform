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

            RetrieveEntityChangesResponse resp = (RetrieveEntityChangesResponse)_serviceClient.Execute(req);
            var moreData = true;

            while (moreData)
            {
                foreach (var change in resp.EntityChanges.Changes)
                {
                    var vtx = await _eventMapper.MapEventAsync(change);
                    yield return vtx;
                }                

                moreData = resp.EntityChanges.MoreRecords;
                if (moreData)
                {
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
                }
            }
        }
    }
}