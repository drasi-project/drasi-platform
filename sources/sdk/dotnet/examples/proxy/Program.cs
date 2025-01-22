// See https://aka.ms/new-console-template for more information
using System.Text.Json.Nodes;
using Drasi.Source.SDK.Models;

Console.WriteLine("Hello, World!");


var payload = new JsonObject()
{
    { "name", "John" },
    { "age", 30 }
};

var item = new SourceChange(ChangeOp.INSERT, new SourceElement("123", ["Person"], payload, "s", "e"), 123, 123);

Console.WriteLine(item.ToJson());
//item.ToJson();

//IBootstrapHandler handler = new BootstrapHandler();