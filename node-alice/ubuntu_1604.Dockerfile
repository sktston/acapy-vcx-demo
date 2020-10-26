FROM ubuntu:16.04 AS BASE

ARG uid=1000

RUN apt-get update && \
    apt-get install -y \
      pkg-config \
      libssl-dev \
      libgmp3-dev \
      curl \
      build-essential \
      libsqlite3-dev \
      cmake \
      git \
      python3.5 \
      python3-pip \
      python-setuptools \
      apt-transport-https \
      ca-certificates \
      debhelper \
      wget \
      devscripts \
      libncursesw5-dev \
      libzmq3-dev \
      zip \
      unzip \
      jq


RUN pip3 install -U \
	pip \
	setuptools \
	virtualenv \
	twine \
	plumbum \
	deb-pkg-tools

RUN cd /tmp && \
   curl https://download.libsodium.org/libsodium/releases/libsodium-1.0.18.tar.gz | tar -xz && \
    cd /tmp/libsodium-1.0.18 && \
    ./configure --disable-shared && \
    make && \
    make install && \
    rm -rf /tmp/libsodium-1.0.18

RUN useradd -ms /bin/bash -u $uid indy
USER indy

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain 1.43.1
ENV PATH /home/indy/.cargo/bin:$PATH

ARG INDYSDK_REVISION="master"
ARG INDYSDK_REPO="https://github.com/hyperledger/indy-sdk.git"
WORKDIR /home/indy
RUN git clone "${INDYSDK_REPO}" "./indy-sdk"
RUN cd "/home/indy/indy-sdk" && git checkout "${INDYSDK_REVISION}"

RUN cargo build --release --manifest-path=/home/indy/indy-sdk/libindy/Cargo.toml
USER root
RUN mv /home/indy/indy-sdk/libindy/target/release/*.so /usr/lib

USER indy
RUN cargo build --release --manifest-path=/home/indy/indy-sdk/experimental/plugins/postgres_storage/Cargo.toml
USER root
RUN mv /home/indy/indy-sdk/experimental/plugins/postgres_storage/target/release/*.so /usr/lib

USER indy
RUN cargo build --release --manifest-path=/home/indy/indy-sdk/libnullpay/Cargo.toml
USER root
RUN mv /home/indy/indy-sdk/libnullpay/target/release/*.so /usr/lib

USER indy
RUN cargo build --release --manifest-path=/home/indy/indy-sdk/vcx/libvcx/Cargo.toml
USER root
RUN mv /home/indy/indy-sdk/vcx/libvcx/target/release/*.so /usr/lib


FROM ubuntu:16.04 AS BUILD

RUN apt-get update && \
    apt-get install -y --no-install-recommends\
      libssl-dev \
      apt-transport-https \
      ca-certificates \
      make \
      g++ \
      curl \
      git \
      && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash -u 1000 indy
USER indy

WORKDIR /home/indy

COPY --from=BASE /var/lib/dpkg/info /var/lib/dpkg/info
COPY --from=BASE /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu
COPY --from=BASE /usr/local /usr/local

COPY --from=BASE /usr/lib/libindy.so /usr/lib/libindy.so
#COPY --from=BASE /usr/lib/libindystrgpostgres.so /usr/lib/libindystrgpostgres.so
COPY --from=BASE /usr/lib/libnullpay.so /usr/lib/libnullpay.so
COPY --from=BASE /usr/lib/libvcx.so /usr/lib/libvcx.so

USER root
# RUN groupadd -g 1001 app && \
#    useradd -r -u 1001 -g app app

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

#USER indy
# WORKDIR /home/app/
WORKDIR /home/indy/
COPY ./ ./
RUN npm install
RUN npm run compile
# RUN chown -R app:app /home/app

# USER app
LABEL version="1.0"
LABEL title="node-alice"
LABEL description="Node Alice Holder"

# WORKDIR /home/app/node-alice
WORKDIR /home/indy/node-alice
CMD node alice-multi.js
