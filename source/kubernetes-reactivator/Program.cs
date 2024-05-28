using Dapr.Client;
using k8s;
using kubernetes_reactivator.Models;
using kubernetes_reactivator.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var configuration = BuildConfiguration();
var sourceId = configuration["SOURCE_ID"];
var stateStoreName = configuration["StateStore"] ?? "rg-state";
var pubSubName = configuration["PubSub"] ?? "rg-pubsub";

//var kubeConfig = KubernetesClientConfiguration.BuildDefaultConfig();

var temp = Encoding.UTF8.GetBytes(configuration["kubeconfig"]);
using var ms = new MemoryStream(temp);
var kubeConfig = KubernetesClientConfiguration.BuildConfigFromConfigFile(ms);
var kubeClient = new Kubernetes(kubeConfig);

builder.Services.AddSingleton(kubeClient);
builder.Services.AddControllers();
builder.Services.AddDaprClient();
builder.Services.AddSingleton<ISequenceGenerator>(sp => new SequenceGenerator(sp.GetRequiredService<DaprClient>(), stateStoreName));
builder.Services.AddSingleton<IGraphChangeMapper>(sp => new GraphChangeMapper(sourceId, sp.GetRequiredService<ISequenceGenerator>()));
builder.Services.AddSingleton<IChangePublisher>(sp => new ChangePublisher(sp.GetRequiredService<DaprClient>(), sourceId, pubSubName));
builder.Services.AddSingleton<IStateStore>(sp => new StateStore(sp.GetRequiredService<DaprClient>(), stateStoreName));

builder.Services.AddSingleton<PodWatcher>();
builder.Services.AddSingleton<NamespaceWatcher>();

builder.Services.AddSingleton<IStateFetcher>(sp => sp.GetRequiredService<PodWatcher>());
builder.Services.AddSingleton<IStateFetcher>(sp => sp.GetRequiredService<NamespaceWatcher>());

builder.Services.AddHostedService(sp => sp.GetRequiredService<PodWatcher>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<NamespaceWatcher>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<ISequenceGenerator>());

var app = builder.Build();

app.UseRouting();
//app.UseCloudEvents();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});


app.Run("http://0.0.0.0:80");


static IConfiguration BuildConfiguration()
{
    return new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();
}