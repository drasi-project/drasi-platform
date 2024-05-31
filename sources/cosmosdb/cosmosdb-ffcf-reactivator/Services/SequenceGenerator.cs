using Dapr.Client;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cosmosdb_reactivator.Services
{
    internal class SequenceGenerator : BackgroundService, ISequenceGenerator
    {
        private readonly DaprClient _dapr;
        private readonly string _stateStore;
        private long _current = 0;
        private TaskCompletionSource _init = new TaskCompletionSource();

        public SequenceGenerator(DaprClient dapr, string stateStore)
        {
            _dapr = dapr;
            _stateStore = stateStore;

        }

        public long GetNext()
        {
            _init.Task.Wait();
            return Interlocked.Increment(ref _current);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var lastPersisted = await _dapr.GetStateAsync<long>(_stateStore, "sequence");
            _current = lastPersisted;
            _init.SetResult();
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000);
                var current = Interlocked.Read(ref _current);
                if (current != lastPersisted)
                {
                    await _dapr.SaveStateAsync(_stateStore, "sequence", current);
                    lastPersisted = current;
                }
            }
        }
    }
}
