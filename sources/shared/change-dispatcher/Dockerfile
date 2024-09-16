FROM rust@sha256:fd45a543ed41160eae2ce9e749e5b3c972625b0778104e8962e9bfb113535301 as builder
# rust:1.74
RUN apt-get update && apt-get install -y protobuf-compiler libcurl4 && apt-get clean

WORKDIR /usr/src
COPY ./infrastructure ./infrastructure

RUN cargo new source/shared/change-dispatcher
WORKDIR /usr/src/source/shared/change-dispatcher
COPY ./sources/shared/change-dispatcher/Cargo.toml . 
RUN cargo fetch
COPY ./sources/shared/change-dispatcher .
RUN cargo install --force --path .

    
FROM  gcr.io/distroless/cc@sha256:3b75fdd33932d16e53a461277becf57c4f815c6cee5f6bc8f52457c095e004c8
# gcr.io/distroless/cc 
ENV RUST_BACKTRACE=1
COPY --from=builder /usr/local/cargo/bin/change-dispatcher /usr/local/bin/change-dispatcher
# RUN apt-get update && apt install -y openssl
CMD ["change-dispatcher"]