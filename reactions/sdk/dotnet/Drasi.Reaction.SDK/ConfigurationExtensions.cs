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
                "AwsIamRole" => IdentityType.AwsIamRole,
                "AwsIamAccessKey" => IdentityType.AwsIamAccessKey,
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

        public static string? GetAwsIamAccessKeyId(this IConfiguration config)
        {
            return config.GetValue<string>("AWS_ACCESS_KEY_ID");
        }

        public static string? GetAwsIamSecretKey(this IConfiguration config)
        {
            return config.GetValue<string>("AWS_SECRET_ACCESS_KEY");
        }
    }

    public enum IdentityType
    {
        None,
        MicrosoftEntraWorkloadID,
        ConnectionString,
        AccessKey,
        AwsIamRole,
        AwsIamAccessKey,
    }
}
