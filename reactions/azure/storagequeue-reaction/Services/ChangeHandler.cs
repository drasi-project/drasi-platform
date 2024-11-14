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
using System.Threading.Tasks;
using Azure.Storage.Queues;
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.StorageQueue.Models.Unpacked;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class ChangeHandler : IChangeEventHandler
{
    private readonly QueueClient _queueClient;
    private readonly OutputFormat _format;
    private readonly IChangeFormatter _formatter;
    private readonly ILogger<ChangeHandler> _logger;

    public ChangeHandler(QueueClient queueClient, IConfiguration config, IChangeFormatter changeFormatter, ILogger<ChangeHandler> logger)
    {
        _queueClient = queueClient;
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _logger = logger;
        _formatter = changeFormatter;
    }

    public async Task HandleChange(ChangeEvent evt, object? queryConfig)
    {
        switch (_format)
        {
            case OutputFormat.Packed:
                var resp = await _queueClient.SendMessageAsync(evt.ToJson());
                _logger.LogInformation($"Sent message to queue: {resp.Value.MessageId}");
                break;
            case OutputFormat.Unpacked:
                var notifications = _formatter.Format(evt);
                foreach (var notification in notifications)
                {
                    var dzresp = await _queueClient.SendMessageAsync(notification.ToJson());
                    _logger.LogInformation($"Sent message to queue: {dzresp.Value.MessageId}");
                }
                break;
            default:
                throw new NotSupportedException("Invalid output format");
        }
    }
}

enum OutputFormat
{
    Packed,
    Unpacked
}