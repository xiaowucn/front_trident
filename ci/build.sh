#!/usr/bin/env bash

set -ex
set -o pipefail

run() {
  "$@"
  _exit_code=$?
  if [ ${_exit_code} -ne 0 ]; then
    echo "Error: exec $* with exit code ${_exit_code}"
    exit ${_exit_code}
  fi
}

build() {
  if [[ "${1}" == 'base' ]]; then
    yarn build
  elif [[ "${1}" == 'csc_ipo' ]]; then
    yarn build-csc2
  elif [[ "${1}" == 'citics_tg' ]]; then
    yarn build-citics-tg
  elif [[ "${1}" == 'szse_info' ]]; then
    yarn build-szse-info
  elif [[ "${1}" == 'sse_autodoc' ]]; then
    yarn build-sse-autodoc
  elif [[ "${1}" == 'sse_pdflux' ]]; then
    yarn build-sse-pdflux
  elif [[ "${1}" == 'sse_scriber' ]]; then
    yarn build-sse-scriber
  elif [[ "${1}" == 'htsc_glazer' ]]; then
    yarn build-htsc-invest
  elif [[ "${1}" == 'guosenit' ]]; then
    yarn build-guosen-it
  elif [[ "${1}" == 'citics' ]]; then
    yarn build-citic
  else
    yarn build-"${1}"
  fi

  rm -rf dist/report.html
  find dist -type f -size +100c -print0 | xargs -0 -I {} -P 5 gzipper compress --gzip --gzip-level=5 --zstd --zstd-level=3 --no-color "{}" 1>/dev/null

  if [[ "${1}" == 'base' ]]; then
    return
  elif [[ "${1}" == 'guosenit' ]]; then
    mv dist dist_guosen_it
    return
  elif [[ "${1}" == 'citics' ]]; then
    mv dist dist_citic
    return
  fi

  mv dist "dist_${1}"

}

rm -rf dist*

run yarn install

run build "${BUILD_TARGET,,}"
