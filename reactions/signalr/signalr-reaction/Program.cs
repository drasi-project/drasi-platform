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

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Services;
using Drasi.Reactions.SignalR.Models.Unpacked;
using Drasi.Reactions.SignalR.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;


var builder = WebApplication.CreateBuilder();
builder.Services.AddTransient<QueryHub>();
builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
builder.Services.AddSingleton<IManagementClient, ManagementClient>();
builder.Services.AddSingleton<IChangeFormatter, ChangeFormatter>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowCredentials();
            policy.SetIsOriginAllowed(s => true);
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
        });
});

var azConnStr = Environment.GetEnvironmentVariable("azureSignalRConnectionString");
var signalRBuilder = builder.Services
    .AddSignalR()
    .AddJsonProtocol(cfg => cfg.PayloadSerializerOptions = ModelOptions.JsonOptions);

if (!String.IsNullOrEmpty(azConnStr))
{
    signalRBuilder.AddAzureSignalR(o =>
    {
        o.ConnectionString = azConnStr;
        o.ServerStickyMode = ServerStickyMode.Required;
    });
}
//else
//{
//    Console.WriteLine("Running in stand-alone mode. Please specify an Azure SignalR Service to scale.");
//}

var hub = builder.Build();

hub.UseCors();
hub.UseRouting();
hub.MapHub<QueryHub>("/hub");
hub.Urls.Add("http://0.0.0.0:8080");

var reaction = new ReactionBuilder()
    .UseChangeEventHandler<ChangeHandler>()
    .UseControlEventHandler<ControlSignalHandler>()
    .ConfigureServices((services) =>
    {
        services.AddSingleton<IChangeFormatter, ChangeFormatter>();
        services.AddTransient(sp => hub.Services.GetRequiredService<IHubContext<QueryHub>>());
    })
    .Build();

await Task.WhenAny(
    reaction.StartAsync(), 
    hub.RunAsync());
