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
/// Service for initializing query collections and performing bootstrap
/// </summary>
public interface IQueryInitializationService
{
    /// <summary>
    /// Initializes all configured queries by creating collections and bootstrapping data
    /// </summary>
    Task InitializeQueriesAsync(CancellationToken cancellationToken);
}