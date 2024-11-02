using Drasi.Reaction.SDK.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Drasi.Reaction.SDK.Services
{
    internal class DefaultControlEventHandler<T>(ILogger<DefaultControlEventHandler<T>> logger) : IControlEventHandler<T> where T : class
    {
        private readonly ILogger<DefaultControlEventHandler<T>> _logger = logger;

        public Task HandleControlSignal(ControlEvent evt, T? queryConfig)
        {
            _logger.LogInformation("Received control signal: {ControlEvent}", evt?.ControlSignal?.Kind);
            return Task.CompletedTask;
        }

    }
}
