using System.Text.Json;

namespace debug_reaction.Models
{
    public class RawEvent
    {
        public RawEvent(JsonElement payload)
        {
            Payload = payload;
        }

        public JsonElement Payload { get; }
    }

    public delegate void EventRecievedHandler(RawEvent evt);
}
