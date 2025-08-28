// Copyright 2025 The Drasi Authors.
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

namespace Drasi.Reactions.SyncSemanticKernelVectorStore;

public class QueryConfig : IValidatableObject
{
    [Required(ErrorMessage = "collectionName is required in the query configuration")]
    [JsonPropertyName("collectionName")]
    public string? CollectionName { get; set; }

    [Required(ErrorMessage = "keyField is required in the query configuration")]
    [JsonPropertyName("keyField")]
    public string? KeyField { get; set; }

    [Required(ErrorMessage = "documentTemplate is required in the query configuration")]
    [JsonPropertyName("documentTemplate")]
    public string? DocumentTemplate { get; set; }

    [JsonPropertyName("titleTemplate")]
    public string? TitleTemplate { get; set; }

    [JsonPropertyName("vectorField")]
    public string? VectorField { get; set; } = "content_vector";

    [JsonPropertyName("createCollection")]
    public bool CreateCollection { get; set; } = true;

    [JsonPropertyName("syncPointRetentionDays")]
    public int? SyncPointRetentionDays { get; set; } = 30;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var results = new List<ValidationResult>();

        if (string.IsNullOrWhiteSpace(CollectionName))
        {
            results.Add(new ValidationResult("Collection name cannot be empty", new[] { nameof(CollectionName) }));
        }

        if (string.IsNullOrWhiteSpace(KeyField))
        {
            results.Add(new ValidationResult("Key field cannot be empty", new[] { nameof(KeyField) }));
        }

        if (string.IsNullOrWhiteSpace(DocumentTemplate))
        {
            results.Add(new ValidationResult("Document template cannot be empty", new[] { nameof(DocumentTemplate) }));
        }

        return results;
    }
}