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

using System.Runtime.CompilerServices;
using System.Threading.Channels;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;

namespace DataverseReactivator.Services;

class ChangeMonitor : IChangeMonitor
{
    private readonly IStateStore _stateStore;
    private readonly IEventMapper _eventMapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ChangeMonitor> _logger;
    private readonly string[] _entityList;
    private readonly int _intervalSeconds;

    public ChangeMonitor(IStateStore stateStore, IConfiguration configuration, IEventMapper eventMapper, ILogger<ChangeMonitor> logger)
    {
        _stateStore = stateStore;
        _eventMapper = eventMapper;
        _logger = logger;
        _configuration = configuration;

        var entities = _configuration.GetValue<string>("entities") ?? "";
        var interval = _configuration.GetValue<string>("pollingIntervalSeconds") ?? "30";

        _entityList = entities.Split(',', StringSplitOptions.RemoveEmptyEntries);
        _intervalSeconds = int.Parse(interval);

        if (_entityList.Length == 0)
        {
            throw new InvalidOperationException("entities configuration is required. Provide a comma-separated list of entity names.");
        }

        _logger.LogInformation($"ChangeMonitor configured for entities: {string.Join(", ", _entityList)}");
        _logger.LogInformation($"Polling interval: {_intervalSeconds} seconds");
    }

    public async IAsyncEnumerable<SourceChange> Monitor([EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Starting change monitoring");

        var channel = Channel.CreateBounded<SourceChange>(new BoundedChannelOptions(100)
        {
            FullMode = BoundedChannelFullMode.Wait
        });

        var workers = new List<SyncWorker>();
        var tasks = new List<Task>();

        foreach (var entity in _entityList)
        {
            _logger.LogInformation($"Creating SyncWorker for entity: {entity}");
            var worker = new SyncWorker(
                channel,
                _stateStore,
                _eventMapper,
                _configuration,
                _logger,
                entity,
                _intervalSeconds);

            workers.Add(worker);
            tasks.Add(worker.StartAsync(cancellationToken));
        }

        // Read from channel and yield changes
        await foreach (var change in channel.Reader.ReadAllAsync(cancellationToken))
        {
            yield return change;
        }

        await Task.WhenAll(tasks);
    }
}