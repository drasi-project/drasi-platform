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
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
# gcr.io/distroless/cc-debian11
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/view-svc /usr/local/bin/view-svc
CMD ["view-svc"]