﻿using DebugReaction.Models;
using System.Text.Json;

namespace DebugReaction.Services
{
    public interface IQueryDebugService : IHostedService
    {
        Task<QueryResult> GetQueryResult(string queryId);
        void ProcessRawChange(JsonElement change);
        void ProcessControlSignal(JsonElement change);
        IEnumerable<string> ActiveQueries { get; }
        Task<Dictionary<string, object>> GetDebugInfo(string queryId);
        Task<QueryResult> ReinitializeQuery(string queryId);

        event EventRecievedHandler? OnEventRecieved;
    }
}