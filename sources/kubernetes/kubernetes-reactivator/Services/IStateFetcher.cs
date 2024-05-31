using kubernetes_reactivator.Models;

namespace kubernetes_reactivator.Services
{
    public interface IStateFetcher
    {
        string[] ProvidesLabels { get; }

        Task<(IEnumerable<VertexState> Nodes, IEnumerable<EdgeState> Edges)> GetCurrent(string[] nodeLabels, string[] relLabels);
    }
}