FROM rust@sha256:8fae3b1a63a4dcfb6cf277a49fb5967ccbf479b9e9cee4588a077a9cb216e6d4 as builder 
# rust:1.81-bullseye
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY ./resource_provider_api ./resource_provider_api
RUN cargo new kubernetes_provider
WORKDIR /usr/src/kubernetes_provider
COPY ./kubernetes_provider/Cargo.toml .
RUN cargo fetch

COPY ./kubernetes_provider .
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
# gcr.io/distroless/cc-debian11
COPY --from=builder /usr/local/cargo/bin/kubernetes_provider /usr/local/bin/kubernetes_provider
CMD ["kubernetes_provider"]