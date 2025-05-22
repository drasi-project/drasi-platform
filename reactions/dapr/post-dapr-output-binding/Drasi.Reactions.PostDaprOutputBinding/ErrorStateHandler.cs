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

namespace Drasi.Reactions.PostDaprOutputBinding;

/// <summary>
/// Interface for handling terminal error states.
/// </summary>
public interface IErrorStateHandler
{
    /// <summary>
    /// Terminate the reaction with an error message.
    /// </summary>
    /// <param name="message">Error message explaining the termination reason</param>
    void Terminate(string message);
}

/// <summary>
/// Implementation of the error state handler.
/// </summary>
public class ErrorStateHandler : IErrorStateHandler
{
    /// <inheritdoc />
    public void Terminate(string message)
    {
        Reaction.SDK.Reaction<QueryConfig>.TerminateWithError(message);
    }
}