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
/// Handles terminal error states for the reaction, following the pattern from Dapr reaction.
/// </summary>
public interface IErrorStateHandler
{
    /// <summary>
    /// Terminates the application with an error message.
    /// </summary>
    /// <param name="message">The error message to log before termination</param>
    void Terminate(string message);
}

/// <summary>
/// Default implementation of error state handler that uses the SDK's termination method.
/// </summary>
public class ErrorStateHandler : IErrorStateHandler
{
    public void Terminate(string message)
    {
        Drasi.Reaction.SDK.Reaction<QueryConfig>.TerminateWithError(message);
    }
}