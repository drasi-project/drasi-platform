FROM rust@sha256:8fae3b1a63a4dcfb6cf277a49fb5967ccbf479b9e9cee4588a077a9cb216e6d4 as builder
# rust:1.81-bullseye
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --force --path .

FROM gcr.io/distroless/cc@sha256:3b75fdd33932d16e53a461277becf57c4f815c6cee5f6bc8f52457c095e004c8
# gcr.io/distroless/cc 
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/view-svc /usr/local/bin/view-svc
CMD ["view-svc"]