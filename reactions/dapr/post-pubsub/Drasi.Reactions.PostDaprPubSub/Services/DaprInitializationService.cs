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

using Dapr;
using Dapr.Client;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.PostDaprPubSub;

public interface IDaprInitializationService
{
    Task WaitForDaprSidecarAsync(CancellationToken cancellationToken);
}

public class DaprInitializationService : IDaprInitializationService
{
    private readonly DaprClient _daprClient;
    private readonly ILogger<DaprInitializationService> _logger;
    private readonly IErrorStateHandler _errorStateHandler;

    public DaprInitializationService(
        DaprClient daprClient,
        ILogger<DaprInitializationService> logger,
        IErrorStateHandler errorStateHandler)
    {
        _daprClient = daprClient ?? throw new ArgumentNullException(nameof(daprClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _errorStateHandler = errorStateHandler ?? throw new ArgumentNullException(nameof(errorStateHandler));
    }

    public async Task WaitForDaprSidecarAsync(CancellationToken cancellationToken)
    {
        _logger.LogDebug("Waiting for Dapr sidecar to be available...");
        try
        {
            await _daprClient.WaitForSidecarAsync(cancellationToken);
            _logger.LogInformation("Dapr sidecar is available.");
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Waiting for Dapr sidecar was canceled.");
            throw; // Rethrow to allow the caller to handle cancellation
        }
        catch (DaprException ex)
        {
            var errorMessage = "Dapr sidecar is not available.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
        catch (Exception ex)
        {
            var errorMessage = "Unexpected error while waiting for Dapr sidecar.";
            _logger.LogError(ex, errorMessage);
            _errorStateHandler.Terminate(errorMessage);
            throw;
        }
    }
}