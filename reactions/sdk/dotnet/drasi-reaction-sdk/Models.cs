using System.Text.Json;

namespace Drasi.Reaction.SDK.Models 
{
    public static class ModelOptions
    {
        public static JsonSerializerOptions JsonOptions => Converter.Settings;        
    }
}



