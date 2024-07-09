#!/usr/bin/env bash

# usage: ./log-kafka-topic.sh

if [ -z "$LOG_KAFKA_BROKERS" ]; then
  echo "Environment variable LOG_KAFKA_BROKERS is not set"
  exit 1
fi
if [ -z "$LOG_KAFKA_TOPIC" ]; then
  echo "Environment variable LOG_KAFKA_TOPIC is not set"
  exit 1
fi
echo "Messages in topic $LOG_KAFKA_TOPIC on $LOG_KAFKA_BROKERS:"
/opt/bitnami/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server "$LOG_KAFKA_BROKERS" \
  --topic "$LOG_KAFKA_TOPIC" \
  --from-beginning

