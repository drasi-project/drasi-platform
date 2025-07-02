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

using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Drasi.Reactions.PostDaprPubSub;

public interface IQueryConfigValidationService
{
    Task ValidateQueryConfigsAsync(CancellationToken cancellationToken);
}

public class QueryConfigValidationService : IQueryConfigValidationService
{
    private readonly ILogger<QueryConfigValidationService> _logger;
    private readonly IQueryConfigService _queryConfigService;
    private readonly IErrorStateHandler _errorStateHandler;

    public QueryConfigValidationService(
        ILogger<QueryConfigValidationService> logger,
        IQueryConfigService queryConfigService,
        IErrorStateHandler errorStateHandler)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _queryConfigService = queryConfigService ?? throw new ArgumentNullException(nameof(queryConfigService));
        _errorStateHandler = errorStateHandler ?? throw new ArgumentNullException(nameof(errorStateHandler));
    }

    public Task ValidateQueryConfigsAsync(CancellationToken cancellationToken)
    {
        _logger.LogDebug("Validating query configurations...");

        var queryNames = _queryConfigService.GetQueryNames();
        if (!queryNames.Any())
        {
            _logger.LogWarning("No queries configured.");
            return Task.CompletedTask;
        }

        foreach (var queryName in queryNames)
        {
            QueryConfig? queryConfig;
            queryConfig = _queryConfigService.GetQueryConfig<QueryConfig>(queryName);
            if (queryConfig == null)
            {
                var errorMessage = $"Query configuration for '{queryName}' is null.";
                _logger.LogError(errorMessage);
                _errorStateHandler.Terminate(errorMessage);
                throw new InvalidProgramException(errorMessage);
            }

            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(queryConfig, new ValidationContext(queryConfig), validationResults, validateAllProperties: true))
            {
                var errors = new StringBuilder($"Configuration validation failed for query {queryName}:");
                foreach (var validationResult in validationResults)
                {
                    var members = string.Join(", ", validationResult.MemberNames);
                    errors.AppendLine().Append($"  - {validationResult.ErrorMessage}. Members: {members}");
                }

                var errorMessage = errors.ToString();
                _errorStateHandler.Terminate(errorMessage);
                throw new InvalidProgramException(errorMessage);
            }

            _logger.LogDebug("Validated Query configuration for '{QueryName}'.", queryName);
        }

        _logger.LogInformation("Validated query configurations.");
        return Task.CompletedTask;
    }
}