# Configuration

Create a ```appsetings.json``` file in the CosmosDB Reactivator root directory containing the following values:

|Property|Description|
|----|-------------------|
|SourceConnectionString|Connection string to the source Cosmos Gremlin DB.|
|SourceDatabaseName|Database name of the source Cosmos Gremlin DB.|
|SourceContainerName|Container name of the source Cosmos Gremlin DB.|
|SourceContainerPartitionKey|Partition key of the source Cosmos Gremlin DB.|
|ChangeEventHubConnectionString| The connection string of the Azure Event Hub that the Source Node provides for the Reactivator and Query API Service to pass inbound change events and control messages to the Change Router. Must include the EntityPath component at the end of the connection string. The connection string must grant the Change Router 'Sender' permissions to the Event Hub.|
|DaprHttpEndpoint|The Dapr Http endpoint (default:http://localhost:3500)|
|DaprGrpcEndpoint|The Dapr Grpc endpoint (default:http://localhost:50001)|
|StateStore|Name of the Dapr state store to use to store the change feed cursor (default:statestore)|


Example:

```
{
    "SourceConnectionString":"AccountEndpoint=https://xxx-contoso-humanresources.documents.azure.com:443/;AccountKey=xxx...xxx==;ApiKind=Gremlin;",
    "SourceDatabaseName":"Contoso",
    "SourceContainerName":"HumanResources",
    "SourceContainerPartitionKey":"name",
    "ChangeEventHubConnectionString":"Endpoint=sb://xxx.servicebus.windows.net/;SharedAccessKeyName=sender;SharedAccessKey=xxx...xxx=;EntityPath=source-node-contoso-humanresources-change",
    "StateStore": "statestore"
}
```