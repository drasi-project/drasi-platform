
namespace Drasi.Reaction.SDK.Services
{
    public interface IQueryConfigService
    {
        T? GetQueryConfig<T>(string queryName) where T : class;
        List<string> GetQueryNames();
    }
}