using ChartJs.Blazor.Common.Enums;
using ChartJs.Blazor.Common.Time;
using ChartJs.Blazor.LineChart;
using ChartJs.Blazor.Util;
using debug_reactor.Models;
using System.Collections.Concurrent;
using System.Collections.ObjectModel;
using System.Reactive.Subjects;

namespace debug_reactor.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IQueryDebugService _queryService;

        private LinkedList<RawEvent> _stream = new LinkedList<RawEvent>();

        private Dictionary<string, TimePointCollection> _data = new Dictionary<string, TimePointCollection>()
        {
            [IStatisticsService.QueryHostTime] = new TimePointCollection(),
            [IStatisticsService.EnqueueTime] = new TimePointCollection(),
            [IStatisticsService.ChangeServiceTime] = new TimePointCollection(),
            [IStatisticsService.ChangeDispatcherTime] = new TimePointCollection(),
        };

        public StatisticsService(IQueryDebugService queryService)
        {
            _queryService = queryService;
           
            _queryService.OnEventRecieved += EventRecieved;
        }

        public void Subscribe(string dataset, IObserver<TimePoint> observer)
        {
            _data[dataset].Subscribe(observer);
        }

        public IEnumerable<RawEvent> Stream 
        { 
            get 
            { 
                lock (_stream)
                    return _stream.ToList();
            } 
        } 

        public event EventRecievedHandler? OnEventRecieved;

        private void EventRecieved(RawEvent evt)
        {
            lock (_stream)
            {
                _stream.AddFirst(evt);
                while (_stream.Count > 100)
                    _stream.RemoveLast();
            }
            var tracking = evt.Payload
                .GetProperty("metadata")
                .GetProperty("tracking");

            var enqeueTime = tracking
                .GetProperty("query")
                .GetProperty("enqueued_ms")
                .GetInt64();

            var queryStart = tracking
                .GetProperty("query")
                .GetProperty("queryStart_ms")
                .GetInt64();

            var queryEnd = tracking
                .GetProperty("query")
                .GetProperty("queryEnd_ms")
                .GetInt64();

            var changeDispatcherStart = tracking
                .GetProperty("source")
                .GetProperty("changeDispatcherStart_ms")
                .GetInt64();

            var changeDispatcherEnd = tracking
                .GetProperty("source")
                .GetProperty("changeDispatcherEnd_ms")
                .GetInt64();

            var changeServiceStart = tracking
                .GetProperty("source")
                .GetProperty("changeSvcStart_ms")
                .GetInt64();

            var changeServiceEnd = tracking
                .GetProperty("source")
                .GetProperty("changeSvcEnd_ms")
                .GetInt64();

            var time = DateTimeOffset.FromUnixTimeMilliseconds(queryEnd).DateTime;

            _data[IStatisticsService.QueryHostTime].Add(new TimePoint(time, queryEnd - queryStart));
            _data[IStatisticsService.EnqueueTime].Add(new TimePoint(time, queryStart - enqeueTime));
            _data[IStatisticsService.ChangeServiceTime].Add(new TimePoint(time, changeServiceEnd - changeServiceStart));
            _data[IStatisticsService.ChangeDispatcherTime].Add(new TimePoint(time, changeDispatcherEnd - changeDispatcherStart));

            OnEventRecieved?.Invoke(evt);
        }
    }
}
