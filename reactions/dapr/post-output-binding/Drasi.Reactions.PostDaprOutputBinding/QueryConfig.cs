using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Drasi.Reactions.PostDaprOutputBinding;

/// <summary>
/// Configuration for the PostDaprOutputBinding reaction.
/// Maps Drasi queries to Dapr output bindings.
/// </summary>
public class QueryConfig : IValidatableObject
{
    /// <summary>
    /// Name of the Dapr output binding component to use for publishing.
    /// </summary>
    [Required]
    [JsonPropertyName("bindingName")]
    public string BindingName { get; set; } = "drasi-output-binding";
    
    [Required]
    [JsonPropertyName("bindingOperation")]
    public required string BindingOperation { get; set; }
    
    [JsonPropertyName("bindingMetadataTemplate")]
    public Dictionary<string, object>? BindingMetadataTemplate { get; set; }

    [Required]
    [JsonPropertyName("bindingType")]
    public required string BindingType { get; set; }
    
    public string SecretUserName { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;

    /// <summary>
    /// Whether to pack the events into a single message (true) or send as individual messages (false).
    /// </summary>
    [JsonPropertyName("packed")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public OutputFormat Packed { get; set; } = OutputFormat.Unpacked;
    
    /// <summary>
    /// Maximum consecutive failures before marking query as failed.
    /// </summary>
    [JsonPropertyName("maxFailureCount")]
    public int MaxFailureCount { get; set; } = 5;
    
    /// <summary>
    /// Whether to skip publishing control signals to the topic.
    /// </summary>
    [JsonPropertyName("skipControlSignals")]
    public bool SkipControlSignals { get; set; } = false;
    
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (MaxFailureCount <= 0)
        {
            yield return new ValidationResult("MaxFailureCount must be greater than 0", [nameof(MaxFailureCount)]);
        }
    }
}

public enum OutputFormat
{
    Packed = 1,
    Unpacked = 0
}