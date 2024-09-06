FROM rust:1.74 as builder

RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/shared/query-api
WORKDIR /usr/src/source/shared/query-api
COPY ./sources/shared/query-api/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/query-api .
RUN cargo install --force --path .

    
FROM  gcr.io/distroless/cc
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/query-api /usr/local/bin/query-api
# RUN apt-get update && apt install -y openssl
CMD ["query-api"]