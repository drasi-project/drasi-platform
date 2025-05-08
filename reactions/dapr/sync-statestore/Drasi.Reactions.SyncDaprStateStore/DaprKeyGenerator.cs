using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace Drasi.Reactions.SyncDaprStateStore;

/// <summary>
/// Helper class to generate keys for the Dapr state store based on query configuration.
/// </summary>
public static class DaprKeyGenerator
{
    /// <summary>
    /// Attempts to generate a Dapr state store key based on the query configuration and result data.
    /// </summary>
    /// <param name="config">The configuration for the specific query.</param>
    /// <param name="stateStoreName">The name of the Dapr state store being used.</param>
    /// <param name="data">The result data item.</param>
    /// <param name="logger">Logger instance for reporting errors.</param>
    /// <param name="daprKey">The generated Dapr key if successful, otherwise null.</param>
    /// <returns>True if the key was generated successfully, false otherwise.</returns>
    public static bool TryGenerateKey(
        QueryConfig? config,
        string stateStoreName,
        IDictionary<string, object> data,
        ILogger logger,
        [NotNullWhen(true)] out string? daprKey)
    {
        daprKey = null;

        if (config == null)
        {
            logger.LogError("Cannot generate Dapr key: QueryConfig is null");
            return false;
        }

        if (string.IsNullOrEmpty(config.KeyField))
        {
            logger.LogError("Cannot generate Dapr key: KeyField is not specified in QueryConfig");
            return false;
        }

        if (!data.TryGetValue(config.KeyField, out var keyValueObject))
        {
            logger.LogWarning("Cannot generate Dapr key: KeyField '{KeyField}' not found in the data item", config.KeyField);
            return false;
        }

        if (keyValueObject == null)
        {
            logger.LogWarning("Cannot generate Dapr key: Value for KeyField '{KeyField}' is null", config.KeyField);
            return false;
        }

        string keyValueString = keyValueObject.ToString() ?? string.Empty;
        if (string.IsNullOrEmpty(keyValueString))
        {
            logger.LogWarning("Cannot generate Dapr key: Value for KeyField '{KeyField}' is empty after conversion to string", config.KeyField);
            return false;
        }

        string prefix = "";

        switch (config.KeyPrefix)
        {
            case QueryConfig.KeyPrefixStrategy.None:
                // No prefix needed
                break;

            case QueryConfig.KeyPrefixStrategy.AppId:
                if (string.IsNullOrEmpty(config.AppId))
                {
                    logger.LogError("Cannot generate Dapr key with AppId prefix: AppId is not specified in QueryConfig");
                    return false;
                }
                prefix = $"{config.AppId}||";
                break;

            case QueryConfig.KeyPrefixStrategy.Namespace:
                if (string.IsNullOrEmpty(config.Namespace))
                {
                    logger.LogError("Cannot generate Dapr key with Namespace prefix: Namespace is not specified in QueryConfig");
                    return false;
                }
                 if (string.IsNullOrEmpty(config.AppId))
                {
                    logger.LogError("Cannot generate Dapr key with Namespace prefix: AppId is not specified in QueryConfig");
                    return false;
                }
                prefix = $"{config.Namespace}.{config.AppId}||";
                break;

            case QueryConfig.KeyPrefixStrategy.Name:
                if (string.IsNullOrEmpty(stateStoreName))
                {
                    logger.LogError("Cannot generate Dapr key with Name prefix: State store name is null or empty");
                    return false;
                }
                prefix = $"{stateStoreName}||";
                break;

            default:
                logger.LogError("Cannot generate Dapr key: Unknown KeyPrefixStrategy '{KeyPrefix}'", config.KeyPrefix);
                return false;
        }

        daprKey = $"{prefix}{keyValueString}";
        return true;
    }
}