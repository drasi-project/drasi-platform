FROM rust:1.74 as builder

RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/shared/change-dispatcher
WORKDIR /usr/src/source/shared/change-dispatcher
COPY ./sources/shared/change-dispatcher/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/change-dispatcher .
RUN cargo install --force --path .

    
FROM  gcr.io/distroless/cc
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/change-dispatcher /usr/local/bin/change-dispatcher
# RUN apt-get update && apt install -y openssl
CMD ["change-dispatcher"]