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

using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Services;

/// <summary>
/// Implementation of query configuration validation service
/// </summary>
public class QueryConfigValidationService : IQueryConfigValidationService
{
    private readonly IQueryConfigService _queryConfigService;
    private readonly ILogger<QueryConfigValidationService> _logger;

    public QueryConfigValidationService(
        IQueryConfigService queryConfigService,
        ILogger<QueryConfigValidationService> logger)
    {
        _queryConfigService = queryConfigService ?? throw new ArgumentNullException(nameof(queryConfigService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task ValidateQueryConfigsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Validating query configurations...");

        var queryNames = _queryConfigService.GetQueryNames();
        if (!queryNames.Any())
        {
            _logger.LogWarning("No queries configured.");
            return;
        }

        foreach (var queryName in queryNames)
        {
            QueryConfig? queryConfig;
            try
            {
                queryConfig = _queryConfigService.GetQueryConfig<QueryConfig>(queryName);
                if (queryConfig == null)
                {
                    var errorMessage = $"Query configuration for '{queryName}' is null.";
                    _logger.LogError(errorMessage);
                    throw new InvalidOperationException(errorMessage);
                }
            }
            catch (Exception ex)
            {
                var errorMessage = $"Failed to retrieve query configuration for '{queryName}': {ex.Message}";
                _logger.LogError(ex, errorMessage);
                throw new InvalidOperationException(errorMessage, ex);
            }

            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(queryConfig, new ValidationContext(queryConfig), validationResults, validateAllProperties: true))
            {
                var errors = $"Configuration validation failed for query {queryName}: " + 
                           string.Join(", ", validationResults.Select(vr => vr.ErrorMessage));
                _logger.LogError(errors);
                throw new InvalidOperationException(errors);
            }

            _logger.LogDebug("Query configuration for '{QueryName}' is valid", queryName);
        }

        _logger.LogInformation("Successfully validated {Count} query configurations", queryNames.Count());
    }

}