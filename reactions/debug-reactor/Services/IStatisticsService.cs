using ChartJs.Blazor.Common.Time;
using ChartJs.Blazor.LineChart;
using debug_reactor.Models;
using System.Collections.ObjectModel;
using System.Reactive.Subjects;

namespace debug_reactor.Services
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