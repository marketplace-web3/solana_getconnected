# Bonsol Development Container

# Stage 1: Node setup
FROM debian:stable-slim AS node-slim
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y -q --no-install-recommends \
    build-essential git gnupg2 curl \
    ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV NODE_VERSION=v20.9.0
ENV NVM_DIR=/usr/local/nvm

RUN mkdir -p ${NVM_DIR}
ADD https://raw.githubusercontent.com/creationix/nvm/master/install.sh /usr/local/etc/nvm/install.sh
RUN bash /usr/local/etc/nvm/install.sh

# Stage 2: Solana Dev
FROM ghcr.io/jac18281828/solana:latest

RUN export DEBIAN_FRONTEND=noninteractive && \
    sudo apt-get update && \
    sudo apt-get install -y -q --no-install-recommends \
    unzip && \
    sudo apt-get clean && \
    sudo rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


ENV USER=solana
ARG SOLANA=1.18.26
ENV CARGO_HOME=/usr/local/cargo
ENV RUSTUP_HOME=/usr/local/rustup
ENV PATH=${PATH}:/usr/local/cargo/bin:/go/bin:/home/solana/.local/share/solana/install/releases/${SOLANA}/bin
USER solana

# Set user and working directory
ARG PACKAGE=solana_getconnected
WORKDIR /workspaces/${PACKAGE}

# Install Rust components
RUN rustup component add \
    clippy \
    rust-analyzer

RUN rustup toolchain install stable  && \
    rustup component add rustfmt --toolchain stable

# Install Node
ENV NODE_VERSION=v22.3.0
ENV NVM_DIR=/usr/local/nvm
ENV NVM_NODE_PATH=${NVM_DIR}/versions/node/${NODE_VERSION}
ENV NODE_PATH=${NVM_NODE_PATH}/lib/node_modules
ENV PATH=${NVM_NODE_PATH}/bin:$PATH
COPY --from=node-slim --chown=${USER}:${USER} /usr/local/nvm /usr/local/nvm
RUN bash -c ". $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default"

RUN npm install npm -g
RUN npm install yarn -g

USER tsdev
ADD --chown=${USER}:${USER} --chmod=555 https://bun.sh/install /bun/install.sh

RUN /bun/install.sh && \
    sudo rm -rf /bun

ENV PATH="/home/tsdev/.bun/bin:/go/bin:${PATH}"
