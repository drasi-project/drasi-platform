using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.SignalR.Models.Unpacked;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;

namespace Drasi.Reactions.SignalR.Services
{
    internal class ChangeHandler : IChangeEventHandler
    {
        private readonly IHubContext<QueryHub> _hubContext;
        private readonly IChangeFormatter _changeFormatter;
        private readonly ILogger<ChangeHandler> _logger;

        public ChangeHandler(IHubContext<QueryHub> hubContext, IChangeFormatter changeFormatter, ILogger<ChangeHandler> logger)
        {
            _hubContext = hubContext;
            _changeFormatter = changeFormatter;
            _logger = logger;
        }

        public async Task HandleChange(ChangeEvent evt, object? queryConfig)
        {
            var results = _changeFormatter.Format(evt);
            
            foreach (var result in results)
            {
                await _hubContext.Clients.Group(QueryHub.DefaultGroupName).SendAsync(evt.QueryId, result);
                await _hubContext.Clients.Group(evt.QueryId).SendAsync(evt.QueryId, result);
            }
        }
    }
}
