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

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Service interface for generating embeddings from text
/// </summary>
public interface IEmbeddingService
{
    /// <summary>
    /// Generate an embedding for a single text
    /// </summary>
    Task<ReadOnlyMemory<float>> GenerateEmbeddingAsync(string text, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generate embeddings for multiple texts in batch
    /// </summary>
    Task<IReadOnlyList<ReadOnlyMemory<float>>> GenerateEmbeddingsAsync(IList<string> texts, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the dimensions of the embedding vectors
    /// </summary>
    int? Dimensions { get; }
}