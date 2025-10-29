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

using Azure.Identity;
using Dapr.Client;
using Microsoft.PowerPlatform.Dataverse.Client;
using Proxy.Services;

Console.WriteLine("Starting up");

var config = new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();

var sourceId = config["SOURCE_ID"];
var endpoint = config["endpoint"];
var authMethod = config["authMethod"] ?? "managedidentity";
var managedIdentityClientId = config["managedIdentityClientId"];

Console.WriteLine($"Source ID: {sourceId}");
Console.WriteLine($"Endpoint: {endpoint}");
Console.WriteLine($"Authentication Method: {authMethod}");

// Check for workload identity early
var hasWorkloadIdentity = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("AZURE_FEDERATED_TOKEN_FILE"));
Console.WriteLine($"Workload Identity detected: {hasWorkloadIdentity}");

if (hasWorkloadIdentity)
{
    Console.WriteLine($"  AZURE_CLIENT_ID: {Environment.GetEnvironmentVariable("AZURE_CLIENT_ID")}");
    Console.WriteLine($"  AZURE_TENANT_ID: {Environment.GetEnvironmentVariable("AZURE_TENANT_ID")}");
    Console.WriteLine($"  AZURE_FEDERATED_TOKEN_FILE: {Environment.GetEnvironmentVariable("AZURE_FEDERATED_TOKEN_FILE")}");
}

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDaprClient();
builder.Services.AddSingleton<IEventMapper, JsonEventMapper>();
builder.Services.AddControllers();

// Create ServiceClient - use DefaultAzureCredential which handles both workload identity and managed identity
var uri = new Uri(endpoint?.TrimEnd('/') ?? throw new InvalidOperationException("endpoint is required"));
var dataverseScope = $"{uri.Scheme}://{uri.Host}/.default";
Console.WriteLine($"Creating ServiceClient for {uri}");
Console.WriteLine($"Token scope: {dataverseScope}");

Azure.Core.TokenCredential credential;
if (hasWorkloadIdentity)
{
    // Workload identity - let DefaultAzureCredential detect it automatically
    Console.WriteLine("Using DefaultAzureCredential for Workload Identity");
    credential = new DefaultAzureCredential();
}
else if (!string.IsNullOrEmpty(managedIdentityClientId))
{
    // User-assigned managed identity
    Console.WriteLine($"Using DefaultAzureCredential with ManagedIdentityClientId: {managedIdentityClientId}");
    credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = managedIdentityClientId
    });
}
else
{
    // System-assigned managed identity
    Console.WriteLine("Using DefaultAzureCredential for System-Assigned Managed Identity");
    credential = new DefaultAzureCredential();
}

// ServiceClient requires a token provider function, not TokenCredential directly
builder.Services.AddSingleton<IOrganizationServiceAsync>(sp => new ServiceClient(
    uri,
    async (string instanceUri) =>
    {
        var token = await credential.GetTokenAsync(
            new Azure.Core.TokenRequestContext(new[] { dataverseScope }),
            default);
        return token.Token;
    },
    useUniqueInstance: false,
    logger: null));
builder.Services.AddSingleton<IInititalDataFetcher, InititalDataFetcher>();

var app = builder.Build();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run("http://0.0.0.0:80");