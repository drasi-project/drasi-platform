# End to end tests

## Prerequisites
- Docker
- [Kind](https://kind.sigs.k8s.io/)
- Node
- Build the Drasi CLI and add it to your path

## Running

```bash
npm test
```

## Tools

To manually recreate a clean test cluster and not run any tests run the following

```bash
node recreate-test-cluster.js
```

## Known issues

- Sometimes Kafka fails to initialize properly