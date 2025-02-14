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

using Microsoft.Extensions.Configuration;
using System;

namespace Drasi.Source.SDK;

public static class ConfigurationExtensions
    {
        public static IdentityType GetIdentityType(this IConfiguration config)
        {
            return config.GetValue<string>("IDENTITY_TYPE") switch
            {
                "MicrosoftEntraWorkloadID" => IdentityType.MicrosoftEntraWorkloadID,
                "ConnectionString" => IdentityType.ConnectionString,
                "AccessKey" => IdentityType.AccessKey,
                _ => IdentityType.None,
            };
        }

        public static string? GetConnectionString(this IConfiguration config)
        {
            return config.GetValue<string>("CONNECTION_STRING");
        }

        public static string? GetAccessKey(this IConfiguration config)
        {
            return config.GetValue<string>("ACCESS_KEY");
        }
    }

    public enum IdentityType
    {
        None,
        MicrosoftEntraWorkloadID,
        ConnectionString,
        AccessKey
    }