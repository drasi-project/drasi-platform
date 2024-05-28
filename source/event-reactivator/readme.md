

```yaml
mutations:
- key: kind
  value: ThingCreated
  mutation: >
    MERGE (wh:Warehouse { id: 'default' })
    CREATE (n:Thing {id: $id, name: $name, status: 'new'})-[:LOCATED_AT]->(wh)
- key: kind
  value: ThingChanged
  mutation: >
    MERGE
      (n:Thing {id: $id})
    ON CREATE SET n.name = $name
    ON MATCH SET n.name = $name
- key: kind
  value: ThingSold
  mutation: >
    MERGE
      (n:Thing {id: $id})
    ON CREATE SET n.status = 'sold'
    ON MATCH SET n.status = 'sold'
```

```json
[


  { "kind": "ThingCreated", "id": 1, "name": "foo" }
  ,

  { "kind": "ThingChanged", "id": 1, "name": "foo2" }
  ,
  { "kind": "ThingSold", "id": 1 }

] 
```