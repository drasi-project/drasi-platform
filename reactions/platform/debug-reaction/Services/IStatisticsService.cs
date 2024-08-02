using ChartJs.Blazor.Common.Time;
using ChartJs.Blazor.LineChart;
using DebugReaction.Models;
using System.Collections.ObjectModel;
using System.Reactive.Subjects;

namespace DebugReaction.Services
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