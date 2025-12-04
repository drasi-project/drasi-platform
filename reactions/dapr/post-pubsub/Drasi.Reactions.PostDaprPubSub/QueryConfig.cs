// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Drasi.Reactions.PostDaprPubSub;

/// <summary>
/// Specifies the format mode for publishing events.
/// </summary>
public enum OutputFormat
{
    /// <summary>
    /// Send individual messages for each change (default).
    /// </summary>
    Unpacked = 0,
    
    /// <summary>
    /// Send the entire ChangeEvent as a single message.
    /// </summary>
    Packed = 1
}

/// <summary>
/// Configuration for the PostDaprPubSub reaction.
/// Maps Drasi queries to Dapr pubsub topics.
/// </summary>
public class QueryConfig : IValidatableObject
{
    /// <summary>
    /// Name of the Dapr pubsub component to use for publishing.
    /// </summary>
    [Required]
    [JsonPropertyName("pubsubName")]
    public string PubsubName { get; set; } = "drasi-pubsub";

    /// <summary>
    /// Name of the topic to publish events to.
    /// </summary>
    [Required]
    [JsonPropertyName("topicName")]
    public string TopicName { get; set; } = string.Empty;

    /// <summary>
    /// Specifies how events should be formatted when published.
    /// </summary>
    [JsonPropertyName("format")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public OutputFormat Format { get; set; } = OutputFormat.Unpacked;
    
    /// <summary>
    /// Whether to skip publishing control signals to the topic.
    /// </summary>
    [JsonPropertyName("skipControlSignals")]
    public bool SkipControlSignals { get; set; } = false;
    
    /// <summary>
    /// Handlebar template for formatting Added results.
    /// When specified, the template is applied to each added result before publishing.
    /// </summary>
    [JsonPropertyName("addedResultsTemplate")]
    public string? AddedResultsTemplate { get; set; }
    
    /// <summary>
    /// Handlebar template for formatting Updated results.
    /// When specified, the template is applied to each updated result before publishing.
    /// The template receives both 'before' and 'after' objects.
    /// </summary>
    [JsonPropertyName("updatedResultsTemplate")]
    public string? UpdatedResultsTemplate { get; set; }
    
    /// <summary>
    /// Handlebar template for formatting Deleted results.
    /// When specified, the template is applied to each deleted result before publishing.
    /// </summary>
    [JsonPropertyName("deletedResultsTemplate")]
    public string? DeletedResultsTemplate { get; set; }
    
    /// <summary>
    /// Returns true if any template is configured.
    /// </summary>
    [JsonIgnore]
    public bool HasTemplates => 
        !string.IsNullOrEmpty(AddedResultsTemplate) || 
        !string.IsNullOrEmpty(UpdatedResultsTemplate) || 
        !string.IsNullOrEmpty(DeletedResultsTemplate);
    
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        yield break;
    }
}