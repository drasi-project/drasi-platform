FROM bitnami/kafka:3.2.3
COPY log-kafka-topic.sh /log-kafka-topic.sh
ENV LOG_KAFKA_BROKERS="kafka:9092"
ENTRYPOINT ["/log-kafka-topic.sh"]
