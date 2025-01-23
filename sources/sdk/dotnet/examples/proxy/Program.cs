// See https://aka.ms/new-console-template for more information
using System.Runtime.CompilerServices;
using System.Text.Json.Nodes;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;

var proxy = new SourceProxyBuilder()
    .UseBootstrapHandler<BootstrapHandler>()
    .Build();

await proxy.StartAsync();


class BootstrapHandler : IBootstrapHandler
{
    public async IAsyncEnumerable<SourceElement> Bootstrap(BootstrapRequest request, [EnumeratorCancellation]CancellationToken cancellationToken = default)
    {
        yield return new SourceElement("1", ["Person"], new JsonObject
        {
            { "name", "Alice" },
            { "age", 30 }
        });

        yield return new SourceElement("2", ["Person"], new JsonObject
        {
            { "name", "Bob" },
            { "age", 40 }
        });
    }
}