#!/usr/bin/env bash
# Copyright 2024 The Drasi Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


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

