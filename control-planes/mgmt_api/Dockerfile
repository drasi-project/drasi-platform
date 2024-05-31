FROM rust:1.77-bullseye as builder
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev
WORKDIR /usr/src
COPY ./resource_provider_api ./resource_provider_api
RUN cargo new mgmt_api
WORKDIR /usr/src/mgmt_api
COPY ./mgmt_api/Cargo.toml .
RUN cargo fetch
COPY ./mgmt_api .
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11
COPY --from=builder /usr/local/cargo/bin/mgmt_api /usr/local/bin/mgmt_api
CMD ["mgmt_api"]