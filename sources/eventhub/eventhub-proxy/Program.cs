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

﻿using Azure.Messaging.EventHubs.Consumer;
using Dapr.Client;
using Proxy.Services;

Console.WriteLine("Starting up");

var config = new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();

var ev = Environment.GetEnvironmentVariables();

var sourceId = config["SOURCE_ID"];
var entities = config["eventHubs"] ?? "";
var consumerGroup = config["consumerGroup"] ?? EventHubConsumerClient.DefaultConsumerGroupName;
var connectionString = config["connectionString"];
var windowSizeStr = config["bootstrapWindow"] ?? "0";

var windowSize = long.Parse(windowSizeStr);
var entityList = entities.Split(',', StringSplitOptions.RemoveEmptyEntries);

Console.WriteLine($"Source ID: {sourceId}");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprClient();
builder.Services.AddSingleton<IEventMapper>(sp => new JsonEventMapper(sourceId));
builder.Services.AddControllers();
builder.Services.AddSingleton<IInititalHubConsumer>(sp => new InititalHubConsumer(sp.GetRequiredService<IEventMapper>(), connectionString, consumerGroup, windowSize));

var app = builder.Build();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run("http://0.0.0.0:80");

