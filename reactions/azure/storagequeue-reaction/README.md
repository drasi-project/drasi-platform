# Drasi: Azure Storage Queue Reaction

The Azure Storage Queue Reaction enqueues messages on [Azure Storage Queues](https://learn.microsoft.com/en-us/azure/storage/queues/storage-queues-introduction) in response to changes to the result set of a Drasi Continuous Query.  The output format can either be the packed format of the raw query output, an unpacked format where a single message represents one change to the result set, or a custom template format using Handlebars templates.

## Getting started

### Configuration

The reaction takes the following configuration properties:

| Property | Description |
|-|-|
| endpoint | Endpoint of the Storage Account queue service, in the form https://{account-name}.queue.core.windows.net, if not using connection string|
| queueName | Name of Queue. It should already exist on your storage account. |
| format | The output format for the messages that are enqueued. Can be `packed` for the raw query output, `unpacked` for a message per result set change, or `template` for custom formatted messages. |
| template | (Required when format is `template`) A Handlebars template string used to format the output messages. |

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
1. Grant the `Storage Queue Data Contributor` role to the managed identity in the `Access Control (IAM)` pane of the storage account.
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


##### Related links
* [What are managed identities for Azure resources](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)
* [What are workload identities](https://learn.microsoft.com/en-us/entra/workload-id/workload-identities-overview)
* [Azure AD Workload Identity Docs](https://azure.github.io/azure-workload-identity/docs/introduction.html)
* [Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster)
* [Use Microsoft Entra Workload ID with Azure Kubernetes Service (AKS)](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)


#### Connection String

An Azure Storage Account connection string.

| Property | Description |
|-|-|
| kind | ConnectionString |
| connectionString | Connection String of Azure Storage Account.|

##### Related links
* [Configure Azure Storage connection strings](https://learn.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string)

### Examples

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: StorageQueue
  identity:
    kind: ConnectionString
    connectionString: <Connection String of Azure Storage Account>
  properties:    
    queueName: <Name of Queue>
    format: <packed | unpacked | template>
    # template: <Handlebars template (required when format is template)>
  queries:
    query1:
    query2:
```

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: StorageQueue
  identity:
    kind: MicrosoftEntraWorkloadID
    clientId: <Client ID of Managed Identity>
  properties:
    endpoint: https://{account-name}.queue.core.windows.net
    queueName: <Name of Queue>
    format: <packed | unpacked | template>
    # template: <Handlebars template (required when format is template)>
  queries:
    query1:
    query2:
```

## Output formats

### Packed Format

The packed format produces one message per source change that includes all changes to the result set and looks as follows:

```json
{
    "kind":"change",
    "queryId": "query1",
    "sequence": 2,
    "sourceTimeMs": 0,
    "addedResults": [
        { "id": 10, "temperature": 22 }
    ],
    "updatedResults":[{
        "before": { "id": 11, "temperature": 25 },
        "after": { "id": 11, "temperature": 27 } 
    }],
    "deletedResults":[
        { "id": 12, "temperature": 30 }
    ]
}
```


### Unpacked Format

The Unpacked format flattens all the changed result set items into one message per item and looks as follows:

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

### Template Format

The Template format uses [Handlebars templates](https://handlebarsjs.com/) to format each change into a custom message structure. This provides maximum flexibility for integrating with downstream systems that expect specific message formats.

When using the template format, you must provide a `template` property in the reaction configuration. The template has access to the following context variables:

**For change events:**
- `operation`: The type of change - "insert", "update", or "delete"
- `queryId`: The ID of the query that generated the change
- `sequence`: The sequence number of the change event
- `timestamp`: The source timestamp in milliseconds
- `after`: The new/current state of the result (available for insert and update operations)
- `before`: The previous state of the result (available for update and delete operations)

**For control signals:**
- `queryId`: The ID of the query
- `kind`: The kind of control signal
- `timestamp`: The source timestamp in milliseconds

#### Example Configuration

```yaml
kind: Reaction
apiVersion: v1
name: my-reaction
spec:
  kind: StorageQueue
  identity:
    kind: ConnectionString
    connectionString: <Connection String of Azure Storage Account>
  properties:    
    queueName: <Name of Queue>
    format: template
    template: |
      {
        "type": "{{operation}}",
        "query": "{{queryId}}",
        {{#if after}}
        "data": {
          "id": "{{after.id}}",
          "temperature": {{after.temperature}}
        }
        {{/if}}
        {{#if before}}
        "previous": {
          "id": "{{before.id}}",
          "temperature": {{before.temperature}}
        }
        {{/if}}
      }
  queries:
    query1:
```

#### Example Output

For an insert operation:
```json
{
  "type": "insert",
  "query": "query1",
  "data": {
    "id": "10",
    "temperature": 22
  }
}
```

For an update operation:
```json
{
  "type": "update",
  "query": "query1",
  "data": {
    "id": "11",
    "temperature": 27
  },
  "previous": {
    "id": "11",
    "temperature": 25
  }
}
```

For a delete operation:
```json
{
  "type": "delete",
  "query": "query1",
  "previous": {
    "id": "12",
    "temperature": 30
  }
}
```

