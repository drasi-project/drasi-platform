# Configuration

Create a ```.env``` file in the Query API service root directory containing the following values:

|Property|Description|
|----|-------------------|
|PORT|The port number through which clients can call the Source Node Query API service.|
|SOURCE_ID|The ID of the Source Node that the Query API service is a component of. The Query API uses this ID to load its Source Node configuration.|


Example:

```
SOURCE_ID=62f1aaaaaaaaaa80da
PORT=3000
```