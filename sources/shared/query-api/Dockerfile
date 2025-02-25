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

RUN cargo new source/shared/query-api
WORKDIR /usr/src/source/shared/query-api
COPY ./sources/shared/query-api/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/query-api .
RUN cargo install --force --path .

    
FROM  gcr.io/distroless/cc@sha256:b6e1e913f633495eeb80a41e03de1a41aa863e9b19902309b180ffdc4b99db2c
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/query-api /usr/local/bin/query-api
# RUN apt-get update && apt install -y openssl
CMD ["query-api"]
