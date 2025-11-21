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

namespace DataverseReactivator.Services
{
    using System.Threading.Tasks;
    using Drasi.Source.SDK;

    class DeprovisionHandler(IConfiguration configuration, ILogger<DeprovisionHandler> logger) : IDeprovisionHandler
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly ILogger<DeprovisionHandler> _logger = logger;

        public async Task Deprovision(IStateStore stateStore)
        {
            _logger.LogInformation("Deprovisioning Dataverse source...");

            var entities = _configuration["entities"] ?? "";
            var entityList = entities.Split(',', StringSplitOptions.RemoveEmptyEntries);

            foreach (var entity in entityList)
            {
                try
                {
                    _logger.LogInformation($"Deprovisioning entity: {entity}");

                    // Remove stored delta token
                    await stateStore.Delete($"{entity}-deltatoken");

                    _logger.LogInformation($"Successfully deprovisioned entity: {entity}");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error deprovisioning entity {entity}: {ex.Message}");
                }
            }

            _logger.LogInformation("Deprovision complete");
        }
    }
}
