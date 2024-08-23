FROM rust@sha256:b1a225b8995d80c915fec5894dd96fccf90ff4d4266a9b3b6a29d9847f92fa63 as builder

RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --path .

FROM gcr.io/distroless/cc@sha256:3b75fdd33932d16e53a461277becf57c4f815c6cee5f6bc8f52457c095e004c8
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/query-host /usr/local/bin/query-host
CMD ["query-host"]