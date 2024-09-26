using Microsoft.Xrm.Sdk;
using Proxy.Models;

namespace Proxy.Services
{
    interface IEventMapper
    {
        Task<VertexState> MapEventAsync(IChangedItem rawEvent);
    }
}
