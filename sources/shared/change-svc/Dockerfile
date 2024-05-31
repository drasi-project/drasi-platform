FROM rust:1.74 as builder

RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/change-svc
WORKDIR /usr/src/source/change-svc
COPY ./sources/shared/change-svc/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/change-svc . 
RUN cargo install --force --path .


FROM gcr.io/distroless/cc
# FROM debian:latest
ENV RUST_BACKTRACE=1
# RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/change-svc /usr/local/bin/change-svc
CMD ["change-svc"]