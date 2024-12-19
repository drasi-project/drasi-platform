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

namespace Drasi.Reactions.SignalR.Tests;

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reactions.SignalR.Models.Unpacked;
using Microsoft.AspNetCore.SignalR.Client;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Channels;
using ModelOptions = Models.Unpacked.ModelOptions;

public class ReactionTests : IClassFixture<Fixture<object>>
{

    private readonly Fixture<object> _fixture;

    public ReactionTests(Fixture<object> fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async void ChangeEventsAreHandled()
    {
        var hub = _fixture.GetHubConnection();

        await hub.StartAsync();
        var tcs = new TaskCompletionSource();
        
        hub.On<JsonDocument>("query1", (msg) => 
        { 
            try
            {
                Assert.Equal("i", msg.RootElement.GetProperty("op").GetString());
                Assert.Equal("query1", msg.RootElement.GetProperty("payload").GetProperty("source").GetProperty("queryId").GetString());
                Assert.Equal(1, msg.RootElement.GetProperty("payload").GetProperty("after").GetProperty("a").GetInt32());
                Assert.Equal(2, msg.RootElement.GetProperty("payload").GetProperty("after").GetProperty("b").GetInt32());

                tcs.SetResult();
            }
            catch (Exception ex)
            {
                tcs.SetException(ex);
            }
        });

        var myEvt = new ChangeEvent()
        {
            Sequence = 1,
            QueryId = "query1",
            AddedResults = [
                new Dictionary<string, object> { {"a", 1}, {"b", 2} },
            ],
            UpdatedResults = [],
            DeletedResults = []
        };
        
        await _fixture.PublishChangeEvent(myEvt);

        await tcs.Task;        
    }
}