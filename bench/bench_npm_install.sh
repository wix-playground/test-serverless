#!/bin/bash

set -euo pipefail

if [[ ! $(command -v npm) ]]; then
    echo "You need to install npm first"
    exit 1
fi

if [[ ! $(command -v yarn) ]]; then
    curl -o- -L https://yarnpkg.com/install.sh | bash
fi

if [[ ! $(command -v pnpm) ]]; then
    curl -L https://unpkg.com/@pnpm/self-installer | node
fi

if [[ ! $(command -v hyperfine) ]]; then
    brew install hyperfine
fi

NPM_INSTALL="npm install"
YARN_INSTALL="yarn install --non-interactive"
PNPM_INSTALL="pnpm install"
CLEAN_ARTIFACTS="rm -rf ./node_modules ./pnpm-lock.yaml ./package-lock.json ./yarn.lock"
CLEAN_CACHE="npm cache clean --force && yarn cache clean && pnpm store prune"
SCOPE_TO_BENCHMARK=$1
SCRIPTS_TO_BENCHMARK=(
    "${NPM_INSTALL}"
    "${NPM_INSTALL} --prefer-offline"
    "${NPM_INSTALL} --prefer-online"
    "${YARN_INSTALL}"
    "${PNPM_INSTALL}"
    "${PNPM_INSTALL} --prefer-offline"
)

cd "${SCOPE_TO_BENCHMARK}"

# benchmark with clean cache and clean node_modules
hyperfine \
    --prepare "${CLEAN_ARTIFACTS} && ${CLEAN_CACHE}" \
    --cleanup "${CLEAN_ARTIFACTS}" \
    --export-json cold_cache_without_node_modules.json \
    "${SCRIPTS_TO_BENCHMARK[@]}"

# benchmark with warm cache and clean node_modules
hyperfine \
    --warmup 2 \
    --prepare "${CLEAN_ARTIFACTS}" \
    --cleanup "${CLEAN_ARTIFACTS}" \
    --export-json warm_cache_without_node_modules.json \
    "${SCRIPTS_TO_BENCHMARK[@]}"

# benchmark with warm cache and already installed node_modules
hyperfine \
    --warmup 2 \
    --cleanup "${CLEAN_ARTIFACTS}" \
    --export-json warm_cache_with_node_modules.json \
    "${SCRIPTS_TO_BENCHMARK[@]}"
