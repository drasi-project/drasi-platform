namespace Reactivator.Services
{
    class HostedServiceContainer(IEnumerable<SyncWorker> services) : BackgroundService
    {
        private readonly IEnumerable<SyncWorker> _services = services;
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var tasks = new List<Task>();
            foreach (var service in _services)
            {
                tasks.Add(service.StartAsync(stoppingToken));
            }
            return Task.WhenAll(tasks);
        }
    }
}
