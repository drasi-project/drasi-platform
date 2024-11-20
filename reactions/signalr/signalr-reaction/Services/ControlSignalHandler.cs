using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;

namespace Drasi.Reactions.SignalR.Services
{
    internal class ControlSignalHandler : IControlEventHandler
    {
        private readonly IHubContext<QueryHub> _hubContext;
        private readonly IChangeFormatter _changeFormatter;
        private readonly ILogger<ChangeHandler> _logger;

        public ControlSignalHandler(IHubContext<QueryHub> hubContext, IChangeFormatter changeFormatter, ILogger<ChangeHandler> logger)
        {
            _hubContext = hubContext;
            _changeFormatter = changeFormatter;
            _logger = logger;
        }
        public async Task HandleControlSignal(ControlEvent evt, object? queryConfig)
        {
            _logger.LogDebug($"Control signal received for query {evt.QueryId}");

            var result = _changeFormatter.Format(evt);
            
            await _hubContext.Clients.Group(QueryHub.DefaultGroupName).SendAsync(evt.QueryId, result);
            await _hubContext.Clients.Group(evt.QueryId).SendAsync(evt.QueryId, result);
        }
    }
}
