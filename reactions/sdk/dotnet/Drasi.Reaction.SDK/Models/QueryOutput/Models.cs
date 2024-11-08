using System.Text.Json;

namespace Drasi.Reaction.SDK.Models.QueryOutput
{
    public static class ModelOptions
    {
        public static JsonSerializerOptions JsonOptions => Converter.Settings;        
    }
}



