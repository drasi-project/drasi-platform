FROM rust@sha256:b1a225b8995d80c915fec5894dd96fccf90ff4d4266a9b3b6a29d9847f92fa63 as builder
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY ./resource_provider_api ./resource_provider_api
RUN cargo new kubernetes_provider
WORKDIR /usr/src/kubernetes_provider
COPY ./kubernetes_provider/Cargo.toml .
RUN cargo fetch

COPY ./kubernetes_provider .
RUN cargo install --force --path .

FROM gcr.io/distroless/cc@sha256:3b75fdd33932d16e53a461277becf57c4f815c6cee5f6bc8f52457c095e004c8
COPY --from=builder /usr/local/cargo/bin/kubernetes_provider /usr/local/bin/kubernetes_provider
CMD ["kubernetes_provider"]