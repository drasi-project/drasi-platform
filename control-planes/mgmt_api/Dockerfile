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
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
# gcr.io/distroless/cc-debian11
COPY --from=builder /usr/local/cargo/bin/mgmt_api /usr/local/bin/mgmt_api
CMD ["mgmt_api"]