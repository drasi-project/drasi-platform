namespace Drasi.Reaction.SDK;

public class Utils
{
    /// <summary>
    /// Retrieves a configuration value for the Reaction.
    /// </summary>
    /// <param name="key">The configuration key to retrieve.</param>
    /// <param name="defaultValue">The default value to return if the key is not found.</param>
    /// <returns>The configuration value or the default value if the key is not found.</returns>
    /// <example>
    /// <code>
    /// var connectionString = Utils.GetConfigValue("MyConnectionString");
    /// </code>
    /// The above code will retrieve the value of the MyConnectionString configuration key, as defined in the reaction manifest:
    /// <code language="yaml">
    /// kind: Reaction
    /// apiVersion: v1
    /// name: test
    /// spec:
    ///   kind: MyReaction
    ///   properties:
    ///     MyConnectionString: "some connection string"
    ///   queries:
    ///     query1:
    /// </code>
    /// </example>
    public static string? GetConfigValue(string key, string? defaultValue = null)
    {
        return Environment.GetEnvironmentVariable(key) ?? defaultValue;
    }
}