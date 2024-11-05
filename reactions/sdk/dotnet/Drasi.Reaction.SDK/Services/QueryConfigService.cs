using Microsoft.Extensions.Configuration;
using System;

namespace Drasi.Reaction.SDK.Services
{
    internal class QueryConfigService(IConfigDeserializer configDeserializer, IConfiguration appConfig) : IQueryConfigService
    {
        private readonly string _configDirectory = appConfig["QueryConfigPath"] ?? "/etc/queries";
        private readonly IConfigDeserializer _configDeserializer = configDeserializer;

        public List<string> GetQueryNames()
        {
            return Directory.GetFiles(_configDirectory)
                .Select(x => Path.GetFileName(x))
                .ToList();
        }

        public T? GetQueryConfig<T>(string queryName) where T : class
        {
            var data = File.ReadAllText($"{_configDirectory}/{queryName}");
            return _configDeserializer.Deserialize<T>(data);
        }
    }
}
