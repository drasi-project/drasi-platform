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

using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.VectorData;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Factories;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Adapters;

/// <summary>
/// Base class for vector store adapters that provides runtime configuration building
/// </summary>
public abstract class BaseVectorStoreAdapter
{
    protected readonly VectorStoreConfiguration _configuration;
    protected readonly ILogger _logger;

    protected BaseVectorStoreAdapter(VectorStoreConfiguration configuration, ILogger logger)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Builds a runtime VectorStoreCollectionDefinition based on configuration
    /// </summary>
    protected VectorStoreCollectionDefinition BuildCollectionDefinition(
        QueryConfig config,
        Type keyType,
        Type recordType,
        IEmbeddingService? embeddingService = null)
    {
        var properties = new List<VectorStoreProperty>();

        // Use reaction-level configuration
        int actualDimensions = _configuration.EmbeddingDimensions;

        // Use default storage names (could be made configurable later if needed)
        string keyStorageName = "id";
        string contentStorageName = "content";
        string vectorStorageName = "embedding";
        string titleStorageName = "title";

        // Use reaction-level vector configuration
        string distanceFunction = _configuration.DistanceFunction;
        string indexKind = _configuration.IndexKind;
        bool isFilterable = _configuration.IsFilterable;
        bool isFullTextSearchable = _configuration.IsFullTextSearchable;

        // Add key property
        properties.Add(new VectorStoreKeyProperty("Key", keyType)
        {
            StorageName = keyStorageName
        });

        // Add vector property with runtime configuration
        var vectorProperty = new VectorStoreVectorProperty("Vector", typeof(ReadOnlyMemory<float>), actualDimensions)
        {
            StorageName = vectorStorageName,
            DistanceFunction = distanceFunction,
            IndexKind = indexKind
        };

        // Add embedding generator if available
        if (embeddingService != null)
        {
            vectorProperty.EmbeddingGenerator = embeddingService as Microsoft.Extensions.AI.IEmbeddingGenerator;
        }

        properties.Add(vectorProperty);

        // Add data properties with runtime configuration
        properties.Add(new VectorStoreDataProperty("Content", typeof(string))
        {
            StorageName = contentStorageName,
            IsIndexed = isFilterable,
            IsFullTextIndexed = isFullTextSearchable
        });

        properties.Add(new VectorStoreDataProperty("Title", typeof(string))
        {
            StorageName = titleStorageName,
            IsIndexed = isFilterable,
            IsFullTextIndexed = false // Title typically not full-text searchable
        });

        properties.Add(new VectorStoreDataProperty("Timestamp", typeof(DateTimeOffset))
        {
            StorageName = "timestamp",
            IsIndexed = isFilterable,
            IsFullTextIndexed = false
        });

        properties.Add(new VectorStoreDataProperty("Source", typeof(string))
        {
            StorageName = "source",
            IsIndexed = isFilterable,
            IsFullTextIndexed = false
        });

        _logger.LogDebug(
            "Built collection definition with dimensions: {Dimensions}, distance: {Distance}, index: {Index}, filterable: {Filterable}, fulltext: {FullText}",
            actualDimensions, distanceFunction, indexKind, isFilterable, isFullTextSearchable);

        return new VectorStoreCollectionDefinition
        {
            Properties = properties
        };
    }

    /// <summary>
    /// Maps the configured distance function to a store-specific value
    /// </summary>
    protected virtual string MapDistanceFunction(string? configuredFunction)
    {
        // Default mapping - derived classes can override
        return configuredFunction switch
        {
            "Cosine" => DistanceFunction.CosineSimilarity,
            "CosineSimilarity" => DistanceFunction.CosineSimilarity,
            "CosineDistance" => DistanceFunction.CosineDistance,
            "Euclidean" => DistanceFunction.EuclideanDistance,
            "EuclideanDistance" => DistanceFunction.EuclideanDistance,
            "DotProduct" => DistanceFunction.DotProductSimilarity,
            "DotProductSimilarity" => DistanceFunction.DotProductSimilarity,
            "Manhattan" => DistanceFunction.ManhattanDistance,
            "ManhattanDistance" => DistanceFunction.ManhattanDistance,
            _ => DistanceFunction.CosineSimilarity
        };
    }

    /// <summary>
    /// Maps the configured index kind to a store-specific value
    /// </summary>
    protected virtual string MapIndexKind(string? configuredKind)
    {
        // Default mapping - derived classes can override
        return configuredKind switch
        {
            "Hnsw" => IndexKind.Hnsw,
            "Flat" => IndexKind.Flat,
            "IvfFlat" => IndexKind.IvfFlat,
            "DiskAnn" => IndexKind.DiskAnn,
            _ => IndexKind.Hnsw
        };
    }
}