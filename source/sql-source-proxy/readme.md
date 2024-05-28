# Configuration

Create a ```.env``` file in the service root directory containing the following values:

|Property|Description|
|----|-------------------|
|PORT|The port number through which clients can call the service.|
|SOURCE_ID|The ID of the Source Node that the service is a component of. The Query API uses this ID to load its Source Node configuration.|
|database_client|The underlying DB client to use, eg. Postgres, MySql, etc...|
|database_connection_*|The DB specific connection settings|


Example:

```
SOURCE_ID=62f1aaaaaaaaaa80da
PORT=3000
database_client=pg
database_connection_host=reactive-graph.postgres.database.azure.com
database_connection_user=postgres@reactive-graph
database_connection_password=xxxxx
database_connection_database=my-db
database_connection_port=5432
database_connection_ssl=true
```