
namespace Reactivator.Services
{
    class HostedServiceContainer(IEnumerable<HubConsumer> services) : BackgroundService
    {
        private readonly IEnumerable<HubConsumer> _services = services;
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
