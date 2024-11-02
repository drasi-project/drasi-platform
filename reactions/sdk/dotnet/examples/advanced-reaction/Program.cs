
using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models;

var builder = new ReactionBuilder();
builder.UseChangeEventHandler<MyChangeHandler>();

var reaction = builder.Build();

await reaction.StartAsync();


class MyChangeHandler : IChangeEventHandler
{   
    private readonly ILogger<MyChangeHandler> _logger;

    public MyChangeHandler(ILogger<MyChangeHandler> logger)
    {
        _logger = logger;
    }

    public async Task HandleChange(ChangeEvent evt, object? queryConfig)
    {
        _logger.LogInformation($"Received change event: {evt}");
    }
}