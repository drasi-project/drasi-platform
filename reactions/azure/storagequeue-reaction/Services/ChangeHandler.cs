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
using Drasi.Reactions.StorageQueue.Models;
using Drasi.Reactions.StorageQueue.Models.Unpacked;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class ChangeHandler : IChangeEventHandler<QueryConfig>
{
    private readonly QueueClient _queueClient;
    private readonly OutputFormat _format;
    private readonly IChangeFormatter _formatter;
    private readonly ITemplateFormatter _templateFormatter;
    private readonly ILogger<ChangeHandler> _logger;

    public ChangeHandler(QueueClient queueClient, IConfiguration config, IChangeFormatter changeFormatter, ITemplateFormatter templateFormatter, ILogger<ChangeHandler> logger)
    {
        _queueClient = queueClient;
        _format = Enum.Parse<OutputFormat>(config.GetValue("format", "packed") ?? "packed", true);
        _logger = logger;
        _formatter = changeFormatter;
        _templateFormatter = templateFormatter;
    }

    public async Task HandleChange(ChangeEvent evt, QueryConfig? queryConfig)
    {
        switch (_format)
        {
            case OutputFormat.Packed:
                var resp = await _queueClient.SendMessageAsync(evt.ToJson());
                _logger.LogInformation("Sent message to queue: {messageId}", resp.Value.MessageId);
                break;
            case OutputFormat.Unpacked:
                var notifications = _formatter.Format(evt);
                foreach (var notification in notifications)
                {
                    var dzresp = await _queueClient.SendMessageAsync(notification.ToJson());
                    _logger.LogInformation("Sent message to queue: {messageId}", dzresp.Value.MessageId);
                }
                break;
            case OutputFormat.Template:
                if (queryConfig == null)
                {
                    throw new InvalidOperationException("Template format requires query configuration");
                }

                // Process added results
                if (!string.IsNullOrEmpty(queryConfig.Added) && evt.AddedResults.Any())
                {
                    var addedMessages = _templateFormatter.FormatAdded(evt.AddedResults, queryConfig.Added);
                    foreach (var message in addedMessages)
                    {
                        var addedResp = await _queueClient.SendMessageAsync(message);
                        _logger.LogInformation("Sent added message to queue: {messageId}", addedResp.Value.MessageId);
                    }
                }

                // Process updated results
                if (!string.IsNullOrEmpty(queryConfig.Updated) && evt.UpdatedResults.Any())
                {
                    var updatedMessages = _templateFormatter.FormatUpdated(evt.UpdatedResults, queryConfig.Updated);
                    foreach (var message in updatedMessages)
                    {
                        var updatedResp = await _queueClient.SendMessageAsync(message);
                        _logger.LogInformation("Sent updated message to queue: {messageId}", updatedResp.Value.MessageId);
                    }
                }

                // Process deleted results
                if (!string.IsNullOrEmpty(queryConfig.Deleted) && evt.DeletedResults.Any())
                {
                    var deletedMessages = _templateFormatter.FormatDeleted(evt.DeletedResults, queryConfig.Deleted);
                    foreach (var message in deletedMessages)
                    {
                        var deletedResp = await _queueClient.SendMessageAsync(message);
                        _logger.LogInformation("Sent deleted message to queue: {messageId}", deletedResp.Value.MessageId);
                    }
                }
                break;
            default:
                throw new NotSupportedException("Invalid output format");
        }
    }
}