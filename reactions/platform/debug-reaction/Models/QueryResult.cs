using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;

namespace debug_reaction.Models
{
    public class QueryResult : INotifyPropertyChanged
    {
        public HashSet<string> FieldNames { get; } = new();
        public HashSet<Dictionary<string, string>> Data { get; } = new(new EntryComparer());
        public List<string> Errors { get; } = new();
        public string QueryContainerId { get; init; }

        public event PropertyChangedEventHandler? PropertyChanged;

        public void Add(JsonElement item)
        {
            Console.WriteLine($"Adding {item.GetRawText()}");
            var entry = Flatten(item);
            MergeFieldNames(entry);
            Data.Add(entry);
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Data)));
        }

        public void Update(JsonElement before, JsonElement after, JsonElement? groupingKeys)
        {
            Console.WriteLine($"Updating from {before.GetRawText()} to {after.GetRawText()}");
            var entryBefore = Flatten(before);
            var entryAfter = Flatten(after);
            MergeFieldNames(entryAfter);
            Data.Remove(entryBefore);
            if (groupingKeys != null)
            {
                if (groupingKeys.Value.ValueKind == JsonValueKind.Array)
                {
                    var keys = new List<string>();
                    foreach (var gk in groupingKeys.Value.EnumerateArray())
                        keys.Add(gk.ToString());

                    foreach (var item in Data.ToList())
                    {
                        var match = true;
                        foreach (var key in keys)
                        {
                            if (!item.ContainsKey(key) || !entryAfter.ContainsKey(key))
                            {
                                match = false;
                                continue;
                            }

                            if (item[key] != entryAfter[key])
                            {
                                match = false;
                                continue;
                            }
                        }
                        if (match)
                        {
                            Data.Remove(item);
                        }
                    }
                }
            }

            Data.Add(entryAfter);
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Data)));
        }

        public void Delete(JsonElement item)
        {
            Console.WriteLine($"Delete {item.GetRawText()}");
            var entryBefore = Flatten(item);
            Data.Remove(entryBefore);
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Data)));
        }

        public void Clear()
        {
            Data.Clear();
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Data)));
        }

        private Dictionary<string, string> Flatten(JsonElement item)
        {
            var result = new Dictionary<string, string>();
            if (item.ValueKind != JsonValueKind.Object)
                return result;

            foreach (var f in item.EnumerateObject())
            {
                result.Add(f.Name, f.Value.ToString() ?? "");
            }

            return result;
        }

        private void MergeFieldNames(Dictionary<string, string> item)
        {
            foreach (var k in item.Keys)
            {
                if (!FieldNames.Contains(k))
                {
                    FieldNames.Add(k);
                    PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(FieldNames)));
                }
            }
                
        }
    }

    class EntryComparer : IEqualityComparer<Dictionary<string, string>>
    {
        public bool Equals(Dictionary<string, string>? x, Dictionary<string, string>? y)        
        {
            return GetHashCode(x) == GetHashCode(y);
        }

        public int GetHashCode([DisallowNull] Dictionary<string, string> obj)
        {
            var result = 1;

            foreach (var (k, v) in obj)
            {
                result *= k.GetHashCode() + v.GetHashCode();
            }

            return result;
        }
    }
}
