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

using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

namespace Drasi.Reaction.SDK.Models.QueryOutput
{
    public static class ModelOptions
    {
        public static JsonSerializerOptions JsonOptions { get; }

        static ModelOptions()
        {
            JsonOptions = new JsonSerializerOptions(Converter.Settings);
            JsonOptions.Converters.Add(new DateTimeConverter());
        }
    }

    public class DateTimeConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null) return default;
            if (reader.TokenType != JsonTokenType.String) throw new JsonException("Expected string token for DateTime.");
            
            var dateStr = reader.GetString();
            if (string.IsNullOrEmpty(dateStr)) return default;

            if (DateTime.TryParse(dateStr, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var dt))
                return dt;
            
            return DateTime.Parse(dateStr, CultureInfo.InvariantCulture);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            var utcValue = value.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
                : value.ToUniversalTime();
                
            writer.WriteStringValue(utcValue.ToString("o", CultureInfo.InvariantCulture));
        }
    }
}



