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

using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Adapter interface that provides a unified way to work with different vector stores
/// without using reflection for every operation.
/// </summary>
public interface IVectorStoreAdapter
{
    /// <summary>
    /// Gets or creates a collection in the vector store.
    /// </summary>
    Task<IVectorCollectionAdapter> GetOrCreateCollectionAsync(
        string collectionName, 
        QueryConfig config, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if a collection exists in the vector store.
    /// </summary>
    Task<bool> CollectionExistsAsync(
        string collectionName, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Ensures a collection is deleted from the vector store if it exists.
    /// Uses Semantic Kernel's EnsureCollectionDeletedAsync method.
    /// Note: Not all vector stores may support this operation.
    /// </summary>
    Task EnsureCollectionDeletedAsync(
        string collectionName, 
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Adapter interface for vector store collection operations.
/// </summary>
public interface IVectorCollectionAdapter
{
    /// <summary>
    /// Gets the name of the collection.
    /// </summary>
    string Name { get; }
    
    /// <summary>
    /// Gets a document from the collection by its key.
    /// </summary>
    Task<VectorDocument?> GetAsync(
        string key,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Upserts documents into the collection.
    /// </summary>
    Task UpsertAsync(
        IEnumerable<VectorDocument> documents, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Deletes documents from the collection by their keys.
    /// </summary>
    Task DeleteAsync(
        IEnumerable<string> keys, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Ensures the collection exists, creating it if necessary.
    /// </summary>
    Task EnsureCollectionExistsAsync(CancellationToken cancellationToken = default);
}