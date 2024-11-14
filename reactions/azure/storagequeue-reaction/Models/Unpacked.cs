using System.Text.Json;

namespace Drasi.Reactions.StorageQueue.Models.Unpacked;

public static class ModelOptions
{
    public static JsonSerializerOptions JsonOptions => Converter.Settings;        
}