using System.Text.Json;

namespace Drasi.Reactions.SignalR.Models.Unpacked;

public static class ModelOptions
{
    public static JsonSerializerOptions JsonOptions => Converter.Settings;        
}