namespace Drasi.Reaction.SDK.Tests;

using Drasi.Reaction.SDK;

public class UnitTest1
{
    [Fact]
    public async void Test1()
    {
        
        var reaction = new ReactionBuilder()
            .UseJsonQueryConfig()
            .UseChangeEventHandler((evt, config) => Task.CompletedTask)
            .Build();
    }
}