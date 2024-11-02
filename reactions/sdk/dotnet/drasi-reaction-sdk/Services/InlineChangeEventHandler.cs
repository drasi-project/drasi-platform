using Drasi.Reaction.SDK.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Drasi.Reaction.SDK.Services
{
    internal class InlineChangeEventHandler<T> : IChangeEventHandler<T> where T : class
    {
        private readonly Func<ChangeEvent, T?, Task> _handler;

        public InlineChangeEventHandler(Func<ChangeEvent, T?, Task> handler)
        {
            _handler = handler;
        }

        public Task HandleChange(ChangeEvent evt, T? queryConfig)
        {
            return _handler(evt, queryConfig as T);
        }
    }
}
