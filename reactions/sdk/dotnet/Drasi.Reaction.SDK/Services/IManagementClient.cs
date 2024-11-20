
namespace Drasi.Reaction.SDK.Services
{
    public interface IManagementClient
    {
        Task<string> GetQueryContainerId(string queryId);
    }
}