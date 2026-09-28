using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.IO;
using System.Text;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Xunit;

namespace Drasi.Reaction.SDK.Tests
{
    public class DateTimeConverterTests
    {
        private class TestModel
        {
            [JsonConverter(typeof(DateTimeConverter))]
            public DateTime Timestamp { get; set; }
        }

        [Fact]
        public void Write_ShouldPreserveMilliseconds()
        {
            // Arrange
            var originalDate = new DateTime(2023, 10, 27, 12, 34, 56, 789, DateTimeKind.Utc);
            var model = new TestModel { Timestamp = originalDate };
            
            var options = new JsonSerializerOptions();
            
            // Act
            var json = JsonSerializer.Serialize(model, options);
            
            // Assert
            Assert.Contains(".789", json); 
        }

        [Fact]
        public void Read_ShouldHandleRoundTripFormat()
        {
             // Arrange
            var json = "{\"Timestamp\":\"2023-10-27T12:34:56.7890000Z\"}";
            
            // Act
            var model = JsonSerializer.Deserialize<TestModel>(json);

            // Assert
            Assert.NotNull(model);
            Assert.Equal(789, model.Timestamp.Millisecond);
            Assert.Equal(DateTimeKind.Utc, model.Timestamp.Kind);
        }
    }
}
