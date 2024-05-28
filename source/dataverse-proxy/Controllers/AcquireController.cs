using Proxy.Models;
using Proxy.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Proxy.Controllers
{
    [Route("acquire")]
    [ApiController]
    public class AcquireController : ControllerBase
    {
        private readonly IInititalDataFetcher _consumer;

        public AcquireController(IInititalDataFetcher consumer)
        {
            _consumer = consumer;
        }

        [HttpPost]
        public async Task<AcquireResponse> Acquire(AcquireRequest request)
        {
            var result = new AcquireResponse();
            foreach (var nl in request.NodeLabels)
            {
                await foreach (var change in _consumer.GetBootstrapData(nl, CancellationToken.None))
                {
                    if (change != null)
                        result.Nodes.Add(change);
                }                
            }

            return result;
        }
    }
}
