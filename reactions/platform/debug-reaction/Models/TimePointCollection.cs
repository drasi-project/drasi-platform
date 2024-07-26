using ChartJs.Blazor.Common.Time;
using System.Reactive.Subjects;

namespace debug_reaction.Models
{
    public class TimePointCollection
    {
        const int RETENTION_WINDOW = -15;

        private Subject<TimePoint> _subject = new Subject<TimePoint>();
        private LinkedList<TimePoint> _history = new LinkedList<TimePoint>();

        public void Subscribe(IObserver<TimePoint> observer)
        {
            foreach (var dp in _history)
                observer.OnNext(dp);
            _subject.Subscribe(observer);
        }

        public void Add(TimePoint point)
        {
            _subject.OnNext(point);
            _history.AddLast(point);

            var windowStart = DateTimeOffset.UtcNow.AddMinutes(RETENTION_WINDOW).DateTime;

            while (_history.Count > 0 && _history.First.Value.Time < windowStart)
                _history.RemoveFirst();
        }
    }
}
