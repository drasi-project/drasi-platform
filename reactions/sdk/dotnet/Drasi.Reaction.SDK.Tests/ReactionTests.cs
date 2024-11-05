namespace Drasi.Reaction.SDK.Tests;

using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models;
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