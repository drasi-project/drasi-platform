# GraphQL Reactor

```yml
apiVersion: query.reactive-graph.io/v1
kind: Reaction
metadata:
  name: gql1
spec:
  reactorType: GraphQL
  queries:
    - queryId: query1
      options: >
        type query1 {
          Category: String
          Id: Int
          Name: String
        }
```
