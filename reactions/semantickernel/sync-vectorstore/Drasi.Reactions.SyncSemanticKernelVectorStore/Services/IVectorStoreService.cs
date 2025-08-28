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

using System.Text.Json.Serialization;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Service interface for vector store operations
/// </summary>
public interface IVectorStoreService
{
    /// <summary>
    /// Get or create a collection for a specific query
    /// </summary>
    Task<object> GetOrCreateCollectionAsync(string collectionName, QueryConfig config, CancellationToken cancellationToken = default);

    /// <summary>
    /// Upsert documents into a collection
    /// </summary>
    Task UpsertAsync(object collection, IEnumerable<VectorDocument> documents, CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete documents from a collection
    /// </summary>
    Task DeleteAsync(object collection, IEnumerable<string> keys, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if a collection exists
    /// </summary>
    Task<bool> CollectionExistsAsync(string collectionName, CancellationToken cancellationToken = default);

}

/// <summary>
/// Represents a document in the vector store.
/// This is a generic document that can work with any data structure.
/// All custom fields are stored in the Metadata dictionary.
/// </summary>
public class VectorDocument
{
    /// <summary>
    /// Unique identifier for the document
    /// This will be used differently based on the vector store:
    /// - For Azure AI Search: Used as a string
    /// - For Qdrant: Converted to Guid
    /// - For InMemory: Used as a string
    /// </summary>
    [JsonPropertyName("id")]
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// The textual content that was vectorized
    /// </summary>
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// The vector representation of the content.
    /// Dimensions will vary based on the embedding model used.
    /// </summary>
    [JsonPropertyName("embedding")]
    public ReadOnlyMemory<float>? Vector { get; set; }

    /// <summary>
    /// Title of the document (optional)
    /// Generated from the titleTemplate in the query configuration
    /// </summary>
    [JsonPropertyName("title")]
    public string? Title { get; set; }


    /// <summary>
    /// Timestamp when the document was created/updated
    /// </summary>
    [JsonPropertyName("timestamp")]
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

    /// <summary>
    /// Source of the document (always "drasi" for documents from Drasi queries)
    /// </summary>
    [JsonPropertyName("source")]
    public string Source { get; set; } = "drasi";
}