FROM rust@sha256:fd45a543ed41160eae2ce9e749e5b3c972625b0778104e8962e9bfb113535301 as builder
# rust:1.74

RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/shared/query-api
WORKDIR /usr/src/source/shared/query-api
COPY ./sources/shared/query-api/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/query-api .
RUN cargo install --force --path .

    
FROM  gcr.io/distroless/cc@sha256:b6e1e913f633495eeb80a41e03de1a41aa863e9b19902309b180ffdc4b99db2c
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/query-api /usr/local/bin/query-api
# RUN apt-get update && apt install -y openssl
CMD ["query-api"]
