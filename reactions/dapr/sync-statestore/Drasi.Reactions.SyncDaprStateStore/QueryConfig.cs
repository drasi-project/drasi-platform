using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Drasi.Reactions.SyncDaprStateStore;

public class QueryConfig : IValidatableObject
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum KeyPrefixStrategy
    {
        [JsonPropertyName("none")]
        None,

        [JsonPropertyName("appId")]
        AppId,

        [JsonPropertyName("namespace")]
        Namespace,

        [JsonPropertyName("name")]
        Name
    }

    [Required(ErrorMessage = "missing required property in the query configuration")]
    [JsonPropertyName("keyPrefix")]
    public KeyPrefixStrategy? KeyPrefix { get; set; }

    [Required(ErrorMessage = "missing required property in the query configuration")]
    [JsonPropertyName("keyField")]
    public string? KeyField { get; set; }

    [JsonPropertyName("appId")]
    public string? AppId { get; set; }

    [JsonPropertyName("namespace")]
    public string? Namespace { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        switch (KeyPrefix)
        {
            case KeyPrefixStrategy.None:
            case KeyPrefixStrategy.Name:
                if (!string.IsNullOrEmpty(AppId))
                {
                    yield return new ValidationResult(
                        $"appId should not be specified when keyPrefix is '{KeyPrefix}'",
                        [nameof(AppId)]);
                }
                if (!string.IsNullOrEmpty(Namespace))
                {
                    yield return new ValidationResult(
                        $"namespace should not be specified when keyPrefix is '{KeyPrefix}'",
                        [nameof(Namespace)]);
                }
                break;

            case KeyPrefixStrategy.AppId:
                if (string.IsNullOrEmpty(AppId))
                {
                    yield return new ValidationResult(
                        $"appId must be specified when keyPrefix is 'appId'",
                        [nameof(AppId)]);
                }
                if (!string.IsNullOrEmpty(Namespace))
                {
                    yield return new ValidationResult(
                        $"namespace should not be specified when keyPrefix is 'appId'",
                        [nameof(Namespace)]);
                }
                break;

            case KeyPrefixStrategy.Namespace:
                if (string.IsNullOrEmpty(AppId))
                {
                    yield return new ValidationResult(
                        $"appId must be specified when keyPrefix is 'namespace'",
                        [nameof(AppId)]);
                }
                if (string.IsNullOrEmpty(Namespace))
                {
                    yield return new ValidationResult(
                        $"namespace must be specified when keyPrefix is 'namespace'",
                        [nameof(Namespace)]);
                }
                break;
        }
    }
}