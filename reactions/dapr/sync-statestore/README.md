# Sync Dapr State Store Reaction

This reaction synchronizes the results of Drasi queries with a Dapr state store.

The first time it sees a query, it will bulk load the configured state store with all the results of the continuous query available at that time. Thereafter, it will process incremental changes from Drasi queries and ensures that the state store is kept up-to-date with the latest query results.

## Features

- **Initial Sync**: Performs a full synchronization of query results with the state store when the reaction starts.
- **Incremental Updates**: Handles incremental changes (added, updated, and deleted results) from Drasi queries.
- **Sync Point Management**: Tracks the last processed sequence number for each query to ensure idempotency and reliability.

## Configuration

### Pre-Requisite

1. Your Dapr State Store needs to be deployed and configured to be used already.
2. Your data store should be accessible from the `drasi-system` namespace in your kubernetes cluster.
3. Deploy another Dapr State Store component in the `drasi-system` namespace. This should be identical to the config you are using for the component used by your app, except that this will be deployed in the `drasi-system` namespace.

### Requirements

Ensure that the reaction provider is registered with Drasi by running this command:

```sh
drasi list reactionprovider
```

If `SyncDaprStateStore` is listed in the available reaction providers, you can deploy a reaction of this type.

If it is not available, then define the reaction provider in a `reaction-provider.yaml` file like:

```yaml
apiVersion: v1
kind: ReactionProvider
name: SyncDaprStateStore
spec:
  services:
    reaction:
      image: reaction-sync-dapr-statestore
```

Apply this Reaction Provider using drasi apply:

```sh
drasi apply -f reaction-provider.yaml
```

### Reaction Configuration (`reaction.yaml`)

Define the reaction and its queries in the `reaction.yaml` file. 
Each query must specify its own configuration in JSON format with the following properties:
- `keyField`: The field in the query result that will be used as the key in the state store.
- `stateStoreName`: The name of the Dapr state store where the query results will be stored.

Example:

```yaml
kind: Reaction
apiVersion: v1
name: sync-dapr-statestore
spec:
  kind: SyncDaprStateStore
  queries:
    query-one: '{"stateStoreName": "state-store-one", "keyField": "id"}'
    query-two: '{"stateStoreName": "state-store-two", "keyField": "key"}'
```