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

using System.Text.Json;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Service interface for processing query results into vector documents
/// </summary>
public interface IDocumentProcessor
{
    /// <summary>
    /// Process query result data into vector documents
    /// </summary>
    Task<IEnumerable<VectorDocument>> ProcessDocumentsAsync(
        IEnumerable<Dictionary<string, object>> results,
        QueryConfig config,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Extract key from a query result
    /// </summary>
    string ExtractKey(Dictionary<string, object> result, QueryConfig config);

    /// <summary>
    /// Generate document text from a query result using the configured template
    /// </summary>
    string GenerateDocumentText(Dictionary<string, object> result, QueryConfig config);
    
    /// <summary>
    /// Generate title for a document
    /// </summary>
    string? GenerateTitle(Dictionary<string, object> result, QueryConfig config);
}