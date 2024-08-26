FROM rust@sha256:b1a225b8995d80c915fec5894dd96fccf90ff4d4266a9b3b6a29d9847f92fa63 as builder
# rust:1.77-bullseye
RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --path .

FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
# gcr.io/distroless/cc-debian11
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/query-host /usr/local/bin/query-host
CMD ["query-host"]