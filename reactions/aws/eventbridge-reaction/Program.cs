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

using Amazon.EventBridge;
using Amazon.EventBridge.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Drasi.Reaction.SDK;

using Drasi.Reactions.EventBridge.Services;

var reaction = new ReactionBuilder()
                   .UseChangeEventHandler<ChangeHandler>()
                   .UseControlEventHandler<ControlSignalHandler>()
                   .ConfigureServices((services) =>
                   {
                      services.AddSingleton<IChangeFormatter>(sp =>
                      {
                          var configuration = sp.GetRequiredService<IConfiguration>();
                          var format = configuration.GetValue("format", "packed")?.ToLower() ?? "packed";
                          
                          if (format == "handlebars")
                          {
                              var logger = sp.GetRequiredService<ILogger<HandlebarsChangeFormatter>>();
                              return new HandlebarsChangeFormatter(configuration, logger);
                          }
                          else
                          {
                              return new ChangeFormatter();
                          }
                      });
                      services.AddSingleton<AmazonEventBridgeClient>(sp =>
                      {
                          var configuration = sp.GetRequiredService<IConfiguration>();
                          switch (configuration.GetIdentityType())
                          {
                            case IdentityType.AwsIamRole:
                              return new AmazonEventBridgeClient();
                            case IdentityType.AwsIamAccessKey:
                              var accessKey = configuration.GetAwsIamAccessKeyId();
                              var secretKey = configuration.GetAwsIamSecretKey();
                              return new AmazonEventBridgeClient(accessKey, secretKey);
                            default:
                              Reaction<object>.TerminateWithError("Invalid Identity Type. Valid values are AwsIamRole and AwsIamAccessKey");
                              throw new Exception("Invalid Identity Type. Valid values are AwsIamRole and AwsIamAccessKey");
                          }
                      });
                   })
                     .Build();


await reaction.StartAsync();
