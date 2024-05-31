FROM --platform=$BUILDPLATFORM rust:1.70 as builder

RUN apt-get update && apt-get install -y protobuf-compiler cmake libc6-dev libssl-dev libclang-dev

WORKDIR /usr/src
COPY . .
WORKDIR /usr/src
RUN cargo install --force --path .

FROM --platform=$TARGETPLATFORM gcr.io/distroless/cc
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/m365-reactivator /usr/local/bin/m365-reactivator
CMD ["m365-reactivator"]