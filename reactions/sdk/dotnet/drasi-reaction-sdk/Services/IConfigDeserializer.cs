namespace Drasi.Reaction.SDK.Services
{
    public interface IConfigDeserializer
    {
        T? Deserialize<T>(string data) where T : class;
    }
}