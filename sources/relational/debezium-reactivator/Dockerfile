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

#
# Build stage
#
FROM --platform=$BUILDPLATFORM maven@sha256:202d9532fc5519f7df02f4b9a6450af93a97a48276bf7975d25f9a10284d366b AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package
# RUN cd /home/app && mvn clean package
# RUN mvn -f /home/app/pom.xml clean package

RUN cd /home/app && mvn dependency:tree
#
# Package stage
#
FROM --platform=$TARGETPLATFORM mcr.microsoft.com/openjdk/jdk@sha256:8f1350862e40b24ba7af80e9f0226990bfadd16eb1b92fd3859f92c9a54b7d30
COPY --from=build /home/app/target /home/app
CMD ["-jar","/home/app/debezium-reactivator-1.0.jar"]