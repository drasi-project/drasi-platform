FROM rust:1.84-bullseye as builder
RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/kubernetes-reactivator /usr/local/bin/kubernetes-reactivator
CMD ["kubernetes-reactivator"]