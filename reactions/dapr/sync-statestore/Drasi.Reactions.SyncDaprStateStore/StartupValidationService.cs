using System.ComponentModel.DataAnnotations;
using System.Text;
using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Drasi.Reactions.SyncDaprStateStore;

public class StartupValidationService : IHostedService
{
    private readonly ILogger<StartupValidationService> _logger;
    private readonly IQueryConfigService _queryConfigService;
    private readonly IConfiguration _configuration;

    public StartupValidationService(
        ILogger<StartupValidationService> logger,
        IQueryConfigService queryConfigService,
        IConfiguration configuration)
    {
        _logger = logger;
        _queryConfigService = queryConfigService;
        _configuration = configuration;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogDebug("Validating reaction configuration...");

        _logger.LogDebug("Validating property 'stateStoreName'...");
        string? stateStoreName = _configuration["stateStoreName"];
        if (string.IsNullOrEmpty(stateStoreName))
        {
            const string stateStoreMissingMessage = "Invalid Reaction Configuration: Required property 'stateStoreName' is missing or empty.";
            _logger.LogError(stateStoreMissingMessage);
            throw new InvalidOperationException(stateStoreMissingMessage);
        }
        _logger.LogDebug("Validated property 'stateStoreName' successfully (Value: {StateStoreName}).", stateStoreName);


        _logger.LogDebug("Validating per-query configurations...");
        var queryNames = _queryConfigService.GetQueryNames();
        if (queryNames.Count == 0)
        {
            _logger.LogWarning("No query configurations found to validate.");
        }

        foreach (var queryName in queryNames)
        {
            try
            {
                _logger.LogDebug("Validating configuration for query: {QueryName}", queryName);
                var config = _queryConfigService.GetQueryConfig<QueryConfig>(queryName);
                if (config == null)
                {
                    string nullConfigError = $"Configuration for query '{queryName}' is null or could not be deserialized.";
                    _logger.LogError(nullConfigError);
                    throw new InvalidOperationException(nullConfigError);
                }

                var validationContextQuery = new ValidationContext(config);
                var validationResultsQuery = new List<ValidationResult>();
                bool isQueryValid = Validator.TryValidateObject(config, validationContextQuery, validationResultsQuery, validateAllProperties: true);
                if (!isQueryValid)
                {
                    var errorBuilder = new StringBuilder();
                    errorBuilder.Append($"Invalid configuration for query '{queryName}':");
                    foreach (var validationResult in validationResultsQuery)
                    {
                        string memberNames = string.Join(", ", validationResult.MemberNames);
                        string errorMessage = validationResult.ErrorMessage ?? "Unknown validation error";
                        _logger.LogError("Validation failed for query '{QueryName}': {ErrorMessage} (Members: {MemberNames})",
                            queryName,
                            errorMessage,
                            memberNames);
                        errorBuilder.Append($" [{memberNames}: {errorMessage}]");
                    }

                    throw new InvalidOperationException(errorBuilder.ToString());
                }
                _logger.LogDebug("Configuration for query '{QueryName}' validated successfully.", queryName);
            }
            catch (Exception ex) when (ex is not InvalidOperationException)
            {
                _logger.LogError(ex, "Error loading or validating configuration for query: {QueryName}", queryName);
                throw new InvalidOperationException($"Failed to load or validate configuration for query '{queryName}'.", ex);
            }
        }

        _logger.LogDebug("All configurations validated successfully.");
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}