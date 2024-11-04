using Drasi.Reaction.SDK.Models;
using System;

namespace Drasi.Reaction.SDK
{
    public interface IChangeEventHandler : IChangeEventHandler<object>
    {
    }

    public interface IChangeEventHandler<TQueryConfig> where TQueryConfig : class
    {
        Task HandleChange(ChangeEvent evt, TQueryConfig? queryConfig);
    }
}
