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

namespace Drasi.Reaction.SDK.Tests;

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.AspNetCore.TestHost;
using System.Net.Http.Json;
using System.Threading.Channels;

public class ReactionTests : IClassFixture<Fixture<object>>
{

    private readonly Fixture<object> _fixture;

    public ReactionTests(Fixture<object> fixture)
    {
        _fixture = fixture;
        _fixture.ClearChannels();
    }

    [Fact]
    public async void ChangeEventsAreHandled()
    {
        var myEvt = new ChangeEvent()
        {
            Sequence = 1,
            QueryId = "query1",
            AddedResults = [],
            UpdatedResults = [],
            DeletedResults = []
        };
        
        await _fixture.Client.PostAsJsonAsync("event", myEvt, ModelOptions.JsonOptions);

        Assert.True(await _fixture.ChangeEventChannel.Reader.WaitToReadAsync(new CancellationTokenSource(TimeSpan.FromSeconds(5)).Token));
        var result = await _fixture.ChangeEventChannel.Reader.ReadAsync();
        Assert.Equal(myEvt.QueryId, result.QueryId);
        Assert.Equal(myEvt.Sequence, result.Sequence);
    }
}