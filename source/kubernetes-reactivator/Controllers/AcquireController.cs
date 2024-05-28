using kubernetes_reactivator.Models;
using kubernetes_reactivator.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kubernetes_reactivator.Controllers
{
    [Route("acquire")]
    [ApiController]
    public class AcquireController : ControllerBase
    {
        private readonly IEnumerable<IStateFetcher> _fetchers;

        public AcquireController(IEnumerable<IStateFetcher> fetchers)
        {
            _fetchers = fetchers;
        }

        [HttpPost]
        public async Task<AcquireResponse> Acquire(AcquireRequest request)
        {
            var result = new AcquireResponse();
            Console.WriteLine($"Acquire data");            
            foreach (var f in _fetchers)
            {
                if (!f.ProvidesLabels.Intersect(request.NodeLabels).Any() && !f.ProvidesLabels.Intersect(request.RelLabels).Any())
                    continue;
                var data = await f.GetCurrent(request.NodeLabels, request.RelLabels);
                result.Nodes.AddRange(data.Nodes);
                result.Rels.AddRange(data.Edges);
            }

            return result;
        }
    }
}
