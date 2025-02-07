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

// using Dapr;
// using Dapr.Actors.Client;
// using Dapr.Client;
// using Drasi.Reactions.Debug.Services;
// using Microsoft.AspNetCore.Components;
// using Microsoft.AspNetCore.Components.Web;

// using System.Text.Json;

using Drasi.Reaction.SDK;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;


var reaction = new ReactionBuilder()
                    .UseChangeEventHandler<ChangeHandler>()
                    .UseControlEventHandler<ControlHandler>()
                    .ConfigureServices((services) =>
                    {
                        services.AddSingleton<IStatisticsService, StatisticsService>();
                        services.AddSingleton<IQueryDebugService, QueryDebugService>();
                        services.AddSingleton<IResultViewClient, ResultViewClient>();
                        services.AddSingleton<IQueryDebugService>(sp => new QueryDebugService(sp.GetRequiredService<IResultViewClient>(), sp.GetRequiredService<IActorProxyFactory>(), sp.GetRequiredService<DaprClient>(), configDirectory, queryContainerId));
                        services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());

                    }).Build();

await reaction.StartAsync();

// var builder = WebApplication.CreateBuilder(args);

// var configuration = BuildConfiguration();

// var pubsubName = configuration.GetValue<string>("PubsubName", "drasi-pubsub");
// var configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
// var queryContainerId = configuration.GetValue<string>("QueryContainer", "default");


// // Add services to the container.
// builder.Services.AddDaprClient();
// builder.Services.AddActors(x => { });
// builder.Services.AddRazorPages();
// builder.Services.AddServerSideBlazor();
// builder.Services.AddSingleton<IResultViewClient, ResultViewClient>();
// builder.Services.AddSingleton<IStatisticsService, StatisticsService>();
// builder.Services.AddSingleton<
// builder.Services.AddHostedService(sp => sp.GetRequiredService<IQueryDebugService>());

// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (!app.Environment.IsDevelopment())
// {
//     app.UseExceptionHandler("/Error");
// }

// app.UseStaticFiles();

// app.UseRouting();
// app.UseCloudEvents();

// //app.MapBlazorHub();
// //app.MapFallbackToPage("/_Host");

// app.UseEndpoints(endpoints =>
// {
//     endpoints.MapSubscribeHandler();
//     endpoints.MapBlazorHub();
//     endpoints.MapFallbackToPage("/_Host");
//     var ep = endpoints.MapPost("event", ProcessEvent);

//     foreach (var qpath in Directory.GetFiles(configDirectory))
//     {
//         var queryId = Path.GetFileName(qpath);
//         ep.WithTopic(pubsubName, queryId + "-results");
//     }        
// });

// // todo: host dapr endpoints on own port, add security
// app.Urls.Add("http://0.0.0.0:80");  //dapr
// app.Urls.Add("http://0.0.0.0:8080"); //app
// app.Run();


// static IConfiguration BuildConfiguration()
// {
//     return new ConfigurationBuilder()
//         .SetBasePath(Directory.GetCurrentDirectory())
//         .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
//         .AddEnvironmentVariables()
//         .Build();
// }

// async Task ProcessEvent(HttpContext context)
// {
//     try
//     {
//         var debugService = context.RequestServices.GetRequiredService<IQueryDebugService>();
//         var data = await JsonDocument.ParseAsync(context.Request.Body);

//         Console.WriteLine("Got event: " + data.RootElement.GetRawText());

//         var evt = data.RootElement;
//         var queryId = evt.GetProperty("queryId").GetString();
//         if (!File.Exists(Path.Combine(configDirectory, queryId)))
//         {
//             Console.WriteLine("Skipping " + queryId);
//             context.Response.StatusCode = 200;
//             return;
//         }
        
//         switch (evt.GetProperty("kind").GetString()) 
//         {
//             case "control":
//                 Console.WriteLine("Processing signal " + queryId);
//                 debugService.ProcessControlSignal(evt);
//                 break;
//             case "change":
//                 Console.WriteLine("Processing change " + queryId);
//                 debugService.ProcessRawChange(evt);
//                 break;
//         }        

//         context.Response.StatusCode = 200;
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Error processing event: {ex.Message}");
//         throw;
//     }
// }