using k8s;
using k8s.Models;
using kubernetes_reactivator.Models;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kubernetes_reactivator.Services
{
    internal class NamespaceWatcher : BackgroundService, IStateFetcher
    {
        private readonly Kubernetes _kubeClient;
        private readonly IChangePublisher _publisher;
        private readonly IStateStore _stateStore;
        private readonly IGraphChangeMapper _mapper;

        public NamespaceWatcher(Kubernetes kubeClient, IChangePublisher publisher, IStateStore stateStore, IGraphChangeMapper mapper)
        {
            _kubeClient = kubeClient;
            _publisher = publisher;
            _stateStore = stateStore;
            _mapper = mapper;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("Watching for namespace changes...");
            while (!stoppingToken.IsCancellationRequested)
            {
                var resp = _kubeClient.CoreV1.ListNamespaceWithHttpMessagesAsync(watch: true);

                await foreach (var (type, item) in resp.WatchAsync<V1Namespace, V1NamespaceList>())
                {
                    try
                    {
                        Console.WriteLine($"{type}:{item.Name()}");
                        switch (type)
                        {
                            case WatchEventType.Added:
                                await _publisher.Publish(_mapper.MapAddedToGraphChanges(item));
                                await _stateStore.SetCurrent(item);
                                break;
                            case WatchEventType.Modified:
                                var prev = await _stateStore.GetPrevious(item);
                                if (prev != null)
                                    await _publisher.Publish(_mapper.MapModifiedToGraphChanges(item, prev));
                                else
                                    await _publisher.Publish(_mapper.MapAddedToGraphChanges(item));
                                await _stateStore.SetCurrent(item);
                                break;

                            case WatchEventType.Deleted:
                                await _publisher.Publish(_mapper.MapDeletedToGraphChanges(item));
                                await _stateStore.Delete(item);
                                break;
                            default:
                                Console.WriteLine($"{type}");
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing change : {ex.Message}");
                    }
                }
            }
        }

        public string[] ProvidesLabels => new string[]
        {
            "Namespace",
        };

        public async Task<(IEnumerable<VertexState> Nodes, IEnumerable<EdgeState> Edges)> GetCurrent(string[] nodeLabels, string[] relLabels)
        {
            var nodes = new List<VertexState>();
            var edges = new List<EdgeState>();
            var resp = await _kubeClient.CoreV1.ListNamespaceAsync();
            foreach (var item in resp.Items)
            {
                var changes = _mapper.MapAddedToGraphChanges(item);
                nodes.AddRange(changes
                    .Where(x => x.Payload.Source.Table == "node" && x.Payload.After != null)
                    .Select(x => x.Payload.After)
                    .Cast<VertexState>()
                    .Where(x => x.Labels.Intersect(nodeLabels).Any()));

                edges.AddRange(changes
                    .Where(x => x.Payload.Source.Table == "rel" && x.Payload.After != null)
                    .Select(x => x.Payload.After)
                    .Cast<EdgeState>()
                    .Where(x => x.Labels.Intersect(relLabels).Any()));
            }

            return (nodes, edges);
        }
    }    
}
