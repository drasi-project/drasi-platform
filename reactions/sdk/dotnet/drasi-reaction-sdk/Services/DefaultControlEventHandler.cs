using Drasi.Reaction.SDK.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Drasi.Reaction.SDK.Services
{
    internal class DefaultControlEventHandler : IControlEventHandler
    {
        public void HandleControlSignal<TQueryConfig>(ControlEvent evt, TQueryConfig? queryConfig) where TQueryConfig : class
        {
        }

    }
}
