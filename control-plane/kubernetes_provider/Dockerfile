FROM rust:1.77-bullseye as builder
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY ./resource_provider_api ./resource_provider_api
RUN cargo new kubernetes_provider
WORKDIR /usr/src/kubernetes_provider
COPY ./kubernetes_provider/Cargo.toml .
RUN cargo fetch

COPY ./kubernetes_provider .
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11
COPY --from=builder /usr/local/cargo/bin/kubernetes_provider /usr/local/bin/kubernetes_provider
CMD ["kubernetes_provider"]