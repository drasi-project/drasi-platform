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

using Xunit;
using Drasi.Reaction.SDK.Services;
using System.Collections.Generic;
using System;

namespace Drasi.Reaction.SDK.Tests
{
    public class YamlDeserializationTests
    {
        public class SampleConfig
        {
            public string Name { get; set; }
            public int Age { get; set; }
            public bool IsActive { get; set; }
            public double Score { get; set; }
            public DateTime CreatedAt { get; set; }
            public Dictionary<string, string> Tags { get; set; }
        }

        [Fact]
        public void Deserialize_SimpleYaml_ShouldSucceed()
        {
            var deserializer = new YamlConfigDeserializer();
            var yaml = @"
name: John Doe
age: 30
isActive: true
score: 95.5
createdAt: 2024-01-01T12:00:00Z
tags:
  env: prod
  tier: frontend
";
            var result = deserializer.Deserialize<SampleConfig>(yaml);

            Assert.NotNull(result);
            Assert.Equal("John Doe", result.Name);
            Assert.Equal(30, result.Age);
            Assert.True(result.IsActive);
            Assert.Equal(95.5, result.Score);
            Assert.Equal(new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc), result.CreatedAt.ToUniversalTime());
            Assert.Equal("prod", result.Tags["env"]);
        }
        public class IssueReproductionConfig
        {
            public string KeyPrefixStrategy { get; set; }
            public string AppId { get; set; }
            public string KeyFieldName { get; set; }
        }

        [Fact]
        public void Deserialize_IssueReproduction_ShouldSucceed()
        {
            var deserializer = new YamlConfigDeserializer();
            var yaml = @"
keyPrefixStrategy: appId
appId: some-appId
keyFieldName: some-name-string
";
            var result = deserializer.Deserialize<IssueReproductionConfig>(yaml);

            Assert.NotNull(result);
            Assert.Equal("appId", result.KeyPrefixStrategy);
            Assert.Equal("some-appId", result.AppId);
            Assert.Equal("some-name-string", result.KeyFieldName);
        }
    }
}
