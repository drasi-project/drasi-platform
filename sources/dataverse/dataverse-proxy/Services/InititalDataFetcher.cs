
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