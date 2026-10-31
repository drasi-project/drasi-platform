
namespace Drasi.Reaction.SDK.Services
{
    public interface IManagementClient
    {
        Task<string> GetQueryContainerId(string queryId);
        Task<bool> WaitForQueryReadyAsync(string queryId, int waitSeconds, CancellationToken cancellationToken);
    }
}