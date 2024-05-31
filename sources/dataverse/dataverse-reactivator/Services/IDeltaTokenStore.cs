namespace Reactivator.Services;
public interface IDeltaTokenStore
{
    Task<string?> GetDeltaToken(string entityName);
    Task SetDeltaToken(string entityName, string token);
}

