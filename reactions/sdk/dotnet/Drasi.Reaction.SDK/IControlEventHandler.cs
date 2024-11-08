using Drasi.Reaction.SDK.Models.QueryOutput;
using System;

namespace Drasi.Reaction.SDK
{
    public interface IControlEventHandler : IControlEventHandler<object>
    {
    }

    public interface IControlEventHandler<TQueryConfig> where TQueryConfig : class
    {
        Task HandleControlSignal(ControlEvent evt, TQueryConfig? queryConfig);
    }
}
