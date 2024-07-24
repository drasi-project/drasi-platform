# Configuration

Create a ```.env``` file in the service root directory containing the following values:

|Property|Description|
|----|-------------------|
|PORT|The port number through which clients can call the service.|
|SOURCE_ID|The ID of the Source Node that the service is a component of. The Query API uses this ID to load its Source Node configuration.|
|SOURCE_CONNECTION_STRING|Connection string to the source graph database. Currently this is limited to Cosmos Gremlin DB. In the future this setting will not be used as the Query API should not be calling the source db directly.|
|SOURCE_CONTAINER_NAME|Container name of the source graph database. In the future this setting will not be used as the Query API should not be calling the source db directly.|
|SOURCE_KEY| Secret key to the source graph database. Currently this is limited to Cosmos Gremlin DB. In the future this setting will not be used as the Query API should not be calling the source db directly.|


Example:

```
SOURCE_ID=62f1aaaaaaaaaa80da
PORT=3000
SOURCE_CONNECTION_STRING=AccountEndpoint=https:/...;AccountKey=...;ApiKind=Gremlin;
SOURCE_DATABASE_NAME=Contoso
SOURCE_CONTAINER_NAME=HumanResources
SOURCE_KEY=xxx...xxx==
```