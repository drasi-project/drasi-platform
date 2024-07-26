using ChartJs.Blazor.Common.Time;
using ChartJs.Blazor.LineChart;
using debug_reaction.Models;
using System.Collections.ObjectModel;
using System.Reactive.Subjects;

namespace debug_reaction.Services
{
    public interface IStatisticsService
    {
        const string QueryHostTime = "QueryHostTime";
        const string EnqueueTime = "EnqueueTime";
        const string ChangeServiceTime = "ChangeServiceTime";
        const string ChangeDispatcherTime = "ChangeDispatcherTime";
        void Subscribe(string dataset, IObserver<TimePoint> observer);

        IEnumerable<RawEvent> Stream { get; }

        event EventRecievedHandler? OnEventRecieved;

    }
}