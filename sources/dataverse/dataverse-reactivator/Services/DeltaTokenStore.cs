using Dapr.Client;
using System.Threading.Tasks;

namespace Reactivator.Services;
public class DaprDeltaTokenStore(DaprClient daprClient, string storeName) : IDeltaTokenStore
{
    private readonly DaprClient _daprClient = daprClient;
    private readonly string _storeName = storeName;

    public async Task<string?> GetDeltaToken(string entityName)
    {
        var state = await _daprClient.GetStateAsync<string?>(_storeName, $"{entityName}");
        return state;
    }

    public async Task SetDeltaToken(string entityName, string token)
    {
        await _daprClient.SaveStateAsync(_storeName, $"{entityName}", token);
    }
}
