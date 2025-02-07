// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

﻿using ChartJs.Blazor.Common.Time;
using System.Reactive.Subjects;

namespace Drasi.Reactions.Debug.Models
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
