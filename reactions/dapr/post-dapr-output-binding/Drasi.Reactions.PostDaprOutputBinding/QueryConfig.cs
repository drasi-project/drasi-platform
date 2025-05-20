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
    
    [Required]
    [JsonPropertyName("bindingType")]
    public required string BindingType { get; set; }

    /// <summary>
    /// Whether to pack the events into a single message (true) or send as individual messages (false).
    /// </summary>
    [JsonPropertyName("packed")]
    public bool Packed { get; set; } = false;
    
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