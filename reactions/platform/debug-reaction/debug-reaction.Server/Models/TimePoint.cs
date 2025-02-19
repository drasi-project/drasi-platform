public struct TimePoint
{
	public DateTime Timestamp { get; }
	public long Duration { get; }

	public TimePoint(DateTime timestamp, long duration)
	{
		Timestamp = timestamp;
		Duration = duration;
	}
}
