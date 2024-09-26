using Dapr.Client;
using System.Threading.Tasks;

namespace Reactivator.Services;
public class DaprCheckpointStore(DaprClient daprClient, string storeName) : ICheckpointStore
{
    private readonly DaprClient _daprClient = daprClient;
    private readonly string _storeName = storeName;

    public async Task<long?> GetSequenceNumber(string entityName, string partitionId)
    {
        var state = await _daprClient.GetStateAsync<long?>(_storeName, $"{entityName}-{partitionId}");
        return state;
    }

    public async Task SetSequenceNumber(string entityName, string partitionId, long sequenceNumber)
    {
        await _daprClient.SaveStateAsync(_storeName, $"{entityName}-{partitionId}", sequenceNumber);
    }
}
