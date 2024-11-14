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

namespace Drasi.Reactions.StorageQueue.Services;

using System;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Storage.Queues;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.StorageQueue.Models.Unpacked;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class ControlSignalHandler : IControlEventHandler
{
    private readonly QueueClient _queueClient;
    private readonly OutputFormat _format;
    private readonly ILogger<ControlSignalHandler> _logger;

    public ControlSignalHandler(QueueClient queueClient, IConfiguration config, ILogger<ControlSignalHandler> logger)
    {
        _queueClient = queueClient;
        _format = Enum.Parse<OutputFormat>(config.GetValue("Format", "packed") ?? "packed", true);
        _logger = logger;
    }

    public async Task HandleControlSignal(ControlEvent evt, object? queryConfig)
    {
        switch (_format)
        {
            case OutputFormat.Packed:
                var resp = await _queueClient.SendMessageAsync(evt.ToJson());
                _logger.LogInformation($"Sent message to queue: {resp.Value.MessageId}");
                break;
            case OutputFormat.Unpacked:
                var notification = new ControlSignalNotification
                {
                    Op = ControlSignalNotificationOp.X,
                    TsMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                    Payload = new ControlSignalNotificationPayload()
                    {
                        Kind = JsonSerializer.Serialize(evt.ControlSignal.Kind, Reaction.SDK.Models.QueryOutput.ModelOptions.JsonOptions).Trim('"'),
                        Source = new SourceClass()
                        {
                            QueryId = evt.QueryId,
                            TsMs = evt.SourceTimeMs
                        },                        
                    }
                };
                var dzresp = await _queueClient.SendMessageAsync(notification.ToJson());
                _logger.LogInformation($"Sent message to queue: {dzresp.Value.MessageId}");
                break;
            default:
                throw new NotSupportedException("Invalid output format");
        }
    }
}
