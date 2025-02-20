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

FROM rust:1.84-bullseye as builder
RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/shared/change-router
WORKDIR /usr/src/source/shared/change-router
COPY ./sources/shared/change-router/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/change-router . 
RUN cargo install --force --path .


FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
ENV RUST_BACKTRACE=1
# RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/change-router /usr/local/bin/change-router
CMD ["change-router"]