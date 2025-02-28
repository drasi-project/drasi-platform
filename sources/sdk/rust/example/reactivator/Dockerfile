FROM rust:1.84-bullseye as builder
RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --force --path .

FROM gcr.io/distroless/cc-debian11@sha256:55a5e011b2c4246b4c51e01fcc2b452d151e03df052e357465f0392fcd59fddf
# gcr.io/distroless/cc-debian11
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/reactivator /usr/local/bin/reactivator
CMD ["reactivator"]