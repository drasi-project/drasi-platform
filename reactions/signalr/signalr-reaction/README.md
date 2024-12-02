# Drasi: SignalR Reaction

The SignalR Reaction exposes a SignalR endpoint where changes to the result sets of the queries it is subscribed to will be published. The details of this format are described below.  Together with the SignalR Reaction, there are also several client libraries that can be used to connect to it.

## Getting started

### Configuration

The reaction takes the following configuration properties:

| Property | Description |
|-|-|
|connectionString|(optional) If you wish to use the Azure SignalR service to host the client connections, specify the connection string here. If this is omitted, the client connections will be hosted within the Reaction process itself. A typical connection string takes the format of `Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;`. If you wish to leverage an identity provider, then the connection string should be `Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure`|


#### Example with Azure SignalR

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: SignalR
  properties:
    connectionString: Endpoint=https://<resource_name>.service.signalr.net;AccessKey=<access_key>;Version=1.0;
  queries:
    query1:
    query2:
```

#### Example without Azure SignalR

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: SignalR
  queries:
    query1:
    query2:
```


### Identity

The reaction supports the following service identities:

#### Microsoft Entra Workload ID

Microsoft Entra Workload Identity enables your reaction to authenticate to Azure without the need to store sensitive credentials. It works by creating a federated identity between a [managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) and the service account the reaction is running against.

| Property | Description |
|-|-|
| kind | MicrosoftEntraWorkloadID |
| clientId | The Client ID of the user managed identity.|

##### AKS Setup

1. On the Azure portal, navigate to the `Security configuration` pane of your AKS cluster.
1. Ensure `Enable Workload Identity` is enabled.
1. Take note of the `Issuer URL` under OIDC.
1. Create or use an existing `User Assigned Managed Identity`.
1. Take note of the `Client ID` an the `Overview` pane of the Managed Identity.
1. Grant the `SignalR App Server` role to the managed identity in the `Access Control (IAM)` pane of the SignalR resource.
1. Create a federated credential between the managed identity and the reaction.
    ```bash
    az identity federated-credential create \
        --name <Give the federated credential a unique name> \
        --identity-name "<Name of the User Assigned Managed Identity>" \
        --resource-group "<Your Resource Group>" \
        --issuer "<The Issuer URL from your AKS cluster OIDC configuration>" \
        --subject system:serviceaccount:"drasi-system":"reaction.<Name of your Reaction>" \
        --audience api://AzureADTokenExchange
    ```

##### Example 


```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: SignalR
  identity:
    kind: MicrosoftEntraWorkloadID
    clientId: <Client ID of Managed Identity>
  properties:
    connectionString: Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure
  queries:
    query1:
    query2:
```


##### Related links
* [What are managed identities for Azure resources](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)
* [What are workload identities](https://learn.microsoft.com/en-us/entra/workload-id/workload-identities-overview)
* [Azure AD Workload Identity Docs](https://azure.github.io/azure-workload-identity/docs/introduction.html)
* [Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster)
* [Use Microsoft Entra Workload ID with Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)

#### Microsoft Entra Application
Microsoft Entra Application Identity enables your reaction to authenticate as an Entra application. 
This provider will mount to appropriate environment variables and key files used by the Azure.Identity SDKs, according to https://learn.microsoft.com/en-us/dotnet/api/azure.identity.environmentcredential

| Property | Description |
|-|-|
| kind | MicrosoftEntraApplication |
| tenantId | The Microsoft Entra tenant (directory) ID.|
| clientId | The client (application) ID of an App Registration in the tenant.|
| secret | A client secret that was generated for the App Registration.|

##### Example
```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: SignalR
  identity:
    kind: MicrosoftEntraApplication
    tenantId: <The Microsoft Entra tenant (directory) ID>
    clientId: <The client (application) ID of an App Registration in the tenant>
    secret: 
      kind: Secret
      name: ***
      value: ***
  properties:
    connectionString: Endpoint=https://<resource_name>.service.signalr.net;AuthType=azure
```


## Output format

The reaction flattens all the changed result set items into one message per item and looks as follows:

An item was added to the result set:
```json
{
    "op": "i",
    "ts_ms": 0,
    "payload": {
        "source": {
            "queryId": "query1",
            "ts_ms": 0
        },
        "after": { 
            "id": 10, 
            "temperature": 22 
        }
    }
}
```

An item was updated in the result set:
```json
{
    "op": "u",
    "ts_ms": 0,
    "payload": {
        "source": {
            "queryId": "query1",
            "ts_ms": 0
        },
        "before": {
            "id": 11, 
            "temperature": 25 
        },
        "after": { 
            "id": 11, 
            "temperature": 27
        }
    }
}
```

An item was removed from the result set:
```json
{
    "op": "d",
    "ts_ms": 0,
    "payload": {
        "source": {
            "queryId": "query1",
            "ts_ms": 0
        },
        "before": { 
            "id": 12, 
            "temperature": 30
        }
    }
}
```

## Client libraries

You can also use one of the client libraries in your front end application to connect to the SignalR endpoint.

### React

#### Install the package

```
npm install --save @drasi/signalr-react
```

#### ResultSet Component

The `ResultSet` component requires an endpoint to the SignalR reaction and a query ID. It will render a copy of it's children for every item in the result set of that query, and keep the data up to date via the SignalR connection.

```jsx
<ResultSet url='<Your Drasi SignalR endpoint>' queryId='<query name>' sortBy={item => item.field1}>
    {item => 
        <div>
            <span>{item.field1}</span>
            <span>{item.field2}</span>
        </div>
    }
</ResultSet>
```

#### Basic example

```javascript
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <table>
          <thead>
            <tr>
              <th>Message ID</th>
              <th>Message From</th>
            </tr>  
          </thead>
          <tbody>
            <ResultSet url='http://localhost:8080/hub' queryId='hello-world-from'>
              {item => 
                <tr>
                  <td>{item.MessageId}</td>
                  <td>{item.MessageFrom}</td>
                </tr>
              }
            </ResultSet>
          </tbody>
        </table>
      </header>
    </div>
  );
}
```

### Vue

#### Install the package

```
npm install --save @drasi/signalr-vue
```

#### ResultSet Component

The `ResultSet` component requires an endpoint to the SignalR reaction and a query ID. It will render a copy of it's children for every item in the result set of that query, and keep the data up to date via the SignalR connection.

```vue
<ResultSet url="<your signalr endpoint>" queryId="<query name>" :sortBy="item => item.field1">
    <template #default="{ item, index }">
        <span>{{ item.field1 }}</span>
        <span>{{ item.field2 }}</span>
    </template>
</ResultSet>
```

#### Basic example

```vue
<script setup>
import { ResultSet } from '@drasi/signalr-vue';
</script>

<template>
  <main>
    <table>
      <thead>
        <tr>
          <th>Message ID</th>
          <th>Message From</th>
        </tr>
      </thead>
      <tbody>
        <ResultSet url="http://localhost:8080/hub" queryId="hello-world-from" :sortBy="x => x.MessageFrom">
          <template #default="{ item, index }">
            <tr>              
              <td>{{ item.MessageId }}</td>
              <td>{{ item.MessageFrom }}</td>
            </tr>
          </template>
        </ResultSet>
      </tbody>
    </table>
  </main>
</template>
```