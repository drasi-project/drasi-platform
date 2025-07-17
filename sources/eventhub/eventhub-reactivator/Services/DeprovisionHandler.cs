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

namespace Reactivator.Services 
{
    using System.Threading.Tasks;
    using Drasi.Source.SDK;
    
    class DeprovisionHandler(IConfiguration configuration, ILogger<DeprovisionHandler> logger) : IDeprovisionHandler
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly ILogger<DeprovisionHandler> _logger = logger;

        public async Task Deprovision(IStateStore stateStore)
        {
            _logger.LogInformation("Deprovisioning source...");

            var entities = _configuration["eventHubs"] ?? "";
            var entityList = entities.Split(',', StringSplitOptions.RemoveEmptyEntries);

            foreach (var entity in entityList)
            {
                try
                {
                    _logger.LogInformation($"Deprovisioning entity: {entity}");

                    var client = HubConsumer.BuildClient(entity, _configuration, _logger);
                    var partitions = await client.GetPartitionIdsAsync();
                    foreach (var partition in partitions)
                    {
                        _logger.LogInformation($"Deprovisioning partition: {partition} for entity: {entity}");
                        await stateStore.Delete($"{entity}-{partition}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error deprovisioning entity {entity}: {ex.Message}");
                }
            }
        }
    }
}