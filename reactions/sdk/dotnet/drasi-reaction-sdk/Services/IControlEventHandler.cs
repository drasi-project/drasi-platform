using Drasi.Reaction.SDK.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Drasi.Reaction.SDK.Services
{
    public interface IControlEventHandler
    {
        void HandleControlSignal<TQueryConfig>(ControlEvent evt, TQueryConfig? queryConfig) where TQueryConfig : class;
    }
}
