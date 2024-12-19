using Microsoft.Extensions.Configuration;
using System;

namespace Drasi.Reaction.SDK
{
    public static class ConfigurationExtensions
    {
        public static IdentityType GetIdentityType(this IConfiguration config)
        {
            return config.GetValue<string>("IDENTITY_TYPE") switch
            {
                "MicrosoftEntraWorkloadID" => IdentityType.MicrosoftEntraWorkloadID,
                "ConnectionString" => IdentityType.ConnectionString,
                "AccessKey" => IdentityType.AccessKey,
                _ => IdentityType.None,
            };
        }

        public static string? GetConnectionString(this IConfiguration config)
        {
            return config.GetValue<string>("CONNECTION_STRING");
        }

        public static string? GetAccessKey(this IConfiguration config)
        {
            return config.GetValue<string>("ACCESS_KEY");
        }
    }

    public enum IdentityType
    {
        None,
        MicrosoftEntraWorkloadID,
        ConnectionString,
        AccessKey
    }
}
