FROM rust@sha256:8fae3b1a63a4dcfb6cf277a49fb5967ccbf479b9e9cee4588a077a9cb216e6d4 as builder
# rust:1.81-bullseye
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --path .

FROM gcr.io/distroless/cc-debian11
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/query-host /usr/local/bin/query-host
CMD ["query-host"]