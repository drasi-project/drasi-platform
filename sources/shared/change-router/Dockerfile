FROM rust:1.74 as builder

RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/shared/change-router
WORKDIR /usr/src/source/shared/change-router
COPY ./sources/shared/change-router/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/change-router . 
RUN cargo install --force --path .


FROM gcr.io/distroless/cc
# FROM debian:latest
ENV RUST_BACKTRACE=1
# RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/change-router /usr/local/bin/change-router
CMD ["change-router"]