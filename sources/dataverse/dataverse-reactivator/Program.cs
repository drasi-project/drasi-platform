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

﻿using System;
using Azure.Identity;
using Dapr.Client;
using Microsoft.PowerPlatform.Dataverse.Client;
using Reactivator.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

Console.WriteLine("Starting up");

var config = new ConfigurationBuilder()
        .AddEnvironmentVariables()
        .Build();

var ev = Environment.GetEnvironmentVariables();

var sourceId = config["SOURCE_ID"];
var stateStoreName = config["StateStore"] ?? "drasi-state";
var pubSubName = config["PubSub"] ?? "drasi-pubsub";
var endpoint = config["endpoint"];
var authMethod = config["authMethod"] ?? "secret"; // Default to secret for Kind/non-Azure
var clientId = config["clientId"];
var secret = config["secret"];
var managedIdentityClientId = config["managedIdentityClientId"]; // Optional: for user-assigned managed identity
var tenantId = config["tenantId"]; // Optional: specify tenant ID for managed identity credential
var entityList = config["entities"]?.Split(",");
var interval = config["interval"] ?? "60";

var intervalSeconds = int.Parse(interval);

Console.WriteLine($"Source ID: {sourceId}");
Console.WriteLine($"Endpoint: {endpoint}");
Console.WriteLine($"Authentication Method: {authMethod}");

// Validate required configuration
if (string.IsNullOrEmpty(sourceId))
    throw new InvalidOperationException("SOURCE_ID environment variable is required");
if (string.IsNullOrEmpty(endpoint))
    throw new InvalidOperationException("endpoint environment variable is required");
if (entityList == null || entityList.Length == 0)
    throw new InvalidOperationException("entities environment variable is required");

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

builder.Services.AddSingleton<IChangePublisher>(sp => new ChangePublisher(sp.GetRequiredService<DaprClient>(), sourceId, pubSubName));
builder.Services.AddSingleton<IDeltaTokenStore>(sp => new DaprDeltaTokenStore(sp.GetRequiredService<DaprClient>(), stateStoreName));
builder.Services.AddSingleton<IEventMapper>(sp => new JsonEventMapper(sourceId));

// Create ServiceClient with managed identity
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

// ServiceClient requires a token provider function
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
builder.Services.AddHostedService<HostedServiceContainer>();

foreach (var entity in entityList)
{
    Console.WriteLine($"Adding consumer for entity {entity}");
    builder.Services.AddSingleton(sp => new SyncWorker(sp.GetRequiredService<IChangePublisher>(), sp.GetRequiredService<IDeltaTokenStore>(), sp.GetRequiredService<IEventMapper>(), sp.GetRequiredService<IOrganizationServiceAsync>(), entity, intervalSeconds));
}

var app = builder.Build();

app.Run("http://0.0.0.0:80");
