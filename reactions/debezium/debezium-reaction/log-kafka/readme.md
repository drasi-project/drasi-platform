# log-kafka helper

This folder contains a definition for a Docker container that can be used to log messages from a Kafka topic to help debug the debezium-reactor.

## Build

Build the container using the Dockerfile in this folder either locally:

```bash
docker build -t log-kafka-topic:latest .
```

Or remotely to your Azure Container Registry (ACR) using the `remote-build.sh` with the `<registry name>` and `<tag>`. For example:

```bash
./remote-build.sh drasi latest
```

This will build and push to `drasi.azurecr.io/log-kafka-topic:latest`.

## Deploy to your Kubernetes cluster

Modify the `log-kafka-topic.yaml` file with the appropriate values for:

- `image`: should specify the name and tag of the container you built in the previous step. For example: `drasi.azurecr.io/log-kafka-topic:latest`
- `LOG_KAFKA_BROKERS` env variable: should specify the Kafka brokers to connect to, which may be comma-separated. For example: `test-kafka:9092`
- `LOG_KAFKA_TOPIC` env variable: should specify the Kafka topic to read from. For example: `my-kafka-topic`
  
You can then deploy the container with:

```bash
kubectl apply -f log-kafka-topic.yaml
```

## Usage

The `log-kafka-topic` container will log all messages from the Kafka topic to the console. You can use `kubectl logs` to view the logs. For example:

```bash
kubectl logs deployment.apps/log-my-kafka-topic
```

If you are using the [Visual Studio Code Kubernetes extension](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools), you can also view the logs from the Kubernetes extension under the `Workloads > Deployments` or `Pods` views, which supports the `Follow Logs` feature.

Note that it will take a while for the container to start up and begin logging messages. This is because it will try to read all messages in the Kafka topic. You can modify this by changing the parameters to the `kafka-console-consumer.sh` in the `log-kafka-topic.sh` script.

## Cleanup

You can remove the container with:

```bash
kubectl delete -f log-kafka-topic.yaml
```
