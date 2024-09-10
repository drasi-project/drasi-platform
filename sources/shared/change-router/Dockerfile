FROM rust@sha256:8fae3b1a63a4dcfb6cf277a49fb5967ccbf479b9e9cee4588a077a9cb216e6d4 as builder
# rust:1.81-bullseye

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