using System.Text.Json;

namespace Drasi.Reaction.SDK.Models.ViewService
{
    public static class ModelOptions
    {
        public static JsonSerializerOptions JsonOptions => Converter.Settings;        
    }
}



