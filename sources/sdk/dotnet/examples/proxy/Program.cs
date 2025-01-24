// See https://aka.ms/new-console-template for more information
using System.Runtime.CompilerServices;
using System.Text.Json.Nodes;
using Drasi.Source.SDK;
using Drasi.Source.SDK.Models;
using Microsoft.Extensions.Configuration;

var proxy = new SourceProxyBuilder()
    .UseBootstrapHandler<BootstrapHandler>()
    .Build();

await proxy.StartAsync();


class BootstrapHandler : IBootstrapHandler
{
    public BootstrapHandler(IConfiguration configuration)
    {
        Console.WriteLine($"Connection string: {configuration["connectionString"]}");
    }

    public async IAsyncEnumerable<SourceElement> Bootstrap(BootstrapRequest request, [EnumeratorCancellation]CancellationToken cancellationToken = default)
    {
        if (request.NodeLabels.Contains("Person"))
        {
            yield return new SourceElement("person-1", ["Person"], new JsonObject
            {
                { "name", "Alice" },
                { "age", 30 }
            });

            yield return new SourceElement("person-2", ["Person"], new JsonObject
            {
                { "name", "Bob" },
                { "age", 40 }
            });
        }

        if (request.RelationLabels.Contains("Knows")) 
        {
            yield return new SourceElement("1-2", ["Knows"], new JsonObject
            {
                { "since", 2010 }
            }, "person-1", "person-2");
        }
    }
}