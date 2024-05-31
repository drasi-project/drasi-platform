using k8s.Models;
using kubernetes_reactivator.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using static Google.Rpc.Context.AttributeContext.Types;

namespace kubernetes_reactivator.Services
{
    internal class GraphChangeMapper : IGraphChangeMapper
    {
        private readonly string _sourceId;
        private readonly ISequenceGenerator _sequence;

        public GraphChangeMapper(string sourceId, ISequenceGenerator sequence)
        {
            _sourceId = sourceId;
            _sequence = sequence;
        }

        public IEnumerable<ChangeNotification> MapAddedToGraphChanges(V1Pod resource)
        {
            var result = new List<ChangeNotification>();

            var podVertex = BuildPodVertex(resource);
            result.Add(BuildVertexInsertNotificaton(podVertex));
            result.Add(BuildEdgeInsertNotificaton(podVertex.Id, $"Namespace:{resource.Namespace()}", "BELONGS_TO"));

            if (resource.Status.ContainerStatuses == null)
                return result;

            foreach (var container in resource.Status.ContainerStatuses)
            {
                var containerVertex = BuildContainerVertex(resource.Metadata, container);
                result.Add(BuildVertexInsertNotificaton(containerVertex));
                result.Add(BuildEdgeInsertNotificaton(podVertex.Id, containerVertex.Id, "HOSTS"));
            }

            return result;
        }

        public IEnumerable<ChangeNotification> MapAddedToGraphChanges(V1Namespace resource)
        {
            var result = new List<ChangeNotification>();

            var nsVertex = BuildNamespaceVertex(resource);
            result.Add(BuildVertexInsertNotificaton(nsVertex));
            
            return result;
        }

        public IEnumerable<ChangeNotification> MapModifiedToGraphChanges(V1Pod current, V1Pod prev)
        {
            var result = new List<ChangeNotification>();

            var podVertex = BuildPodVertex(current);
            result.Add(BuildVertexUpdateNotificaton(podVertex));

            if (current.Status.ContainerStatuses == null)
                return result;

            foreach (var container in current.Status.ContainerStatuses)
            {
                var containerVertex = BuildContainerVertex(current.Metadata, container);
                var prevContainer = prev.Status.ContainerStatuses?.FirstOrDefault(x => x.Name == container.Name);
                if (prevContainer != null)
                {                    
                    result.Add(BuildVertexUpdateNotificaton(containerVertex));
                    continue;
                }
                
                result.Add(BuildVertexInsertNotificaton(containerVertex));
                result.Add(BuildEdgeInsertNotificaton(podVertex.Id, containerVertex.Id, "HOSTS"));
            }

            if (prev.Status.ContainerStatuses == null)
                return result;

            foreach (var prevContainer in prev.Status.ContainerStatuses)
            {
                if (current.Status.ContainerStatuses.All(x => x.Name != prevContainer.Name))
                {
                    var containerVertex = BuildContainerVertex(current.Metadata, prevContainer);
                    result.Add(BuildVertexDeleteNotificaton(containerVertex));
                    result.Add(BuildEdgeDeleteNotificaton(podVertex.Id, containerVertex.Id, "HOSTS"));
                }
            }

            return result;
        }

        public IEnumerable<ChangeNotification> MapModifiedToGraphChanges(V1Namespace current, V1Namespace prev)
        {
            var result = new List<ChangeNotification>();

            var nsVertex = BuildNamespaceVertex(current);
            result.Add(BuildVertexInsertNotificaton(nsVertex));

            return result;
        }

        public IEnumerable<ChangeNotification> MapDeletedToGraphChanges(V1Pod resource)
        {
            var result = new List<ChangeNotification>();

            var podVertex = BuildPodVertex(resource);

            result.Add(BuildVertexDeleteNotificaton(podVertex));
            result.Add(BuildEdgeDeleteNotificaton(podVertex.Id, $"Namespace:{resource.Namespace()}", "BELONGS_TO"));

            if (resource.Status.ContainerStatuses == null)
                return result;

            foreach (var container in resource.Status.ContainerStatuses)
            {
                var containerVertex = BuildContainerVertex(resource.Metadata, container);
                result.Add(BuildVertexDeleteNotificaton(containerVertex));
                result.Add(BuildEdgeDeleteNotificaton(podVertex.Id, containerVertex.Id, "HOSTS"));
            }

            return result;
        }

        public IEnumerable<ChangeNotification> MapDeletedToGraphChanges(V1Namespace resource)
        {
            var result = new List<ChangeNotification>();

            var nsVertex = BuildNamespaceVertex(resource);
            result.Add(BuildVertexDeleteNotificaton(nsVertex));

            return result;
        }

        private ChangeNotification BuildVertexInsertNotificaton(VertexState after)
        {
            var result = new ChangeNotification()
            {
                Op = "i",
                TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Payload = new ChangePayload()
                {
                    Source = new ChangeSource()
                    {
                        Db = _sourceId,
                        LSN = _sequence.GetNext(),
                        Table = "node",
                        TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        TimestampSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    },
                    After = after
                }
            };

            return result;
        }

        private ChangeNotification BuildVertexUpdateNotificaton(VertexState after)
        {
            var result = new ChangeNotification()
            {
                Op = "u",
                TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Payload = new ChangePayload()
                {
                    Source = new ChangeSource()
                    {
                        Db = _sourceId,
                        LSN = _sequence.GetNext(),
                        Table = "node",
                        TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        TimestampSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    },
                    After = after
                }
            };

            return result;
        }

        private ChangeNotification BuildVertexDeleteNotificaton(VertexState before)
        {
            var result = new ChangeNotification()
            {
                Op = "d",
                TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Payload = new ChangePayload()
                {
                    Source = new ChangeSource()
                    {
                        Db = _sourceId,
                        LSN = _sequence.GetNext(),
                        Table = "node",
                        TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        TimestampSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    },
                    Before = before
                }
            };

            return result;
        }

        private ChangeNotification BuildEdgeInsertNotificaton(string outboundId, string inboundId, string label)
        {
            var result = new ChangeNotification()
            {
                Op = "i",
                TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Payload = new ChangePayload()
                {
                    Source = new ChangeSource()
                    {
                        Db = _sourceId,
                        LSN = _sequence.GetNext(),
                        Table = "rel",
                        TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        TimestampSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    },
                    After = new EdgeState()
                    {
                        Id = EncodeId($"{outboundId}:{label}:{inboundId}"),
                        StartId = outboundId,
                        EndId = inboundId,
                        Labels = new List<string> { label },
                        Label = label, // for bootstrap format
                        Properties = new object()
                    }
                }
            };

            return result;
        }

        private ChangeNotification BuildEdgeDeleteNotificaton(string outboundId, string inboundId, string label)
        {
            var result = new ChangeNotification()
            {
                Op = "d",
                TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Payload = new ChangePayload()
                {
                    Source = new ChangeSource()
                    {
                        Db = _sourceId,
                        LSN = _sequence.GetNext(),
                        Table = "rel",
                        TimestampMilliseconds = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        TimestampSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    },
                    Before = new EdgeState()
                    {
                        Id = EncodeId($"{outboundId}:{label}:{inboundId}"),
                        StartId = outboundId,
                        EndId = inboundId,
                        Labels = new List<string> { label },
                        Label = label, // for bootstrap format
                        Properties = new object()
                    }
                }
            };

            return result;
        }

        private VertexState BuildPodVertex(V1Pod resource)
        {
            return new VertexState()
            {
                Id = EncodeId($"Pod:{resource.Namespace()}:{resource.Name()}"),
                Labels = new List<string> { "Pod" },
                Label = "Pod", // for bootstrap format
                Properties = new
                {
                    Name = resource.Name(),
                    PodIP = resource.Status?.PodIP,
                    Phase = resource.Status?.Phase,
                    Message = resource.Status?.Message,
                    HostIP = resource.Status?.HostIP,
                    Reason = resource.Status?.Reason,
                }
            };
        }

        private VertexState BuildNamespaceVertex(V1Namespace resource)
        {
            return new VertexState()
            {
                Id = EncodeId($"Namespace:{resource.Name()}"),
                Labels = new List<string> { "Namespace" },
                Label = "Namespace", // for bootstrap format
                Properties = new
                {
                    Name = resource.Name(),
                    Phase = resource.Status?.Phase,
                }
            };
        }

        private VertexState BuildContainerVertex(V1ObjectMeta owner, V1ContainerStatus container)
        {
            var state = "";
            var message = "";
            var reason = "";
            if (container.State?.Waiting != null)
            {
                state = "Waiting";
                message = container.State?.Waiting.Message;
                reason = container.State?.Waiting.Reason;
            }

            if (container.State?.Terminated != null)
            {
                state = "Terminated";
                message = container.State?.Terminated.Message;
                reason = container.State?.Terminated.Reason;
            }

            if (container.State?.Running != null)
            {
                state = "Running";
            }

            return new VertexState()
            {
                Id = EncodeId($"Container:{owner.Namespace()}:{owner.Name}:{container.Name}"),
                Labels = new List<string> { "Container" },
                Label = "Container", // for bootstrap format
                Properties = new
                {
                    Name = container.Name,
                    Image = container.Image,
                    Started = container.Started,
                    Ready = container.Ready,
                    RestartCount = container.RestartCount,
                    State = state,
                    Message = message,
                    Reason = reason,
                    TerminationMessage = container.LastState?.Terminated?.Message,
                }
            };
        }

        static string EncodeId(string id)
        {
            var hash = SHA1.HashData(Encoding.UTF8.GetBytes(id));
            return Convert.ToBase64String(hash);
        }
    }
}
