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

ARG CARGO_DEBUG=0
FROM rust@sha256:8fae3b1a63a4dcfb6cf277a49fb5967ccbf479b9e9cee4588a077a9cb216e6d4 as builder
# rust:1.81-bullseye
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure
WORKDIR /usr/src/control-planes
COPY ./control-planes/resource_provider_api ./resource_provider_api
RUN cargo new mgmt_api
WORKDIR /usr/src/control-planes/mgmt_api
COPY ./control-planes/mgmt_api/Cargo.toml .
RUN cargo fetch
COPY ./control-planes/mgmt_api .
RUN if [ "$CARGO_DEBUG" = "0" ]; then cargo install --release --force --path .; else cargo install --force --path .; fi

FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
# gcr.io/distroless/cc-debian11
COPY --from=builder /usr/local/cargo/bin/mgmt_api /usr/local/bin/mgmt_api
CMD ["mgmt_api"]