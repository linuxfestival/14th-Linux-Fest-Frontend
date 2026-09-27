#!/bin/sh
set -eu

: "${API_BASE_URL:=/}"
export API_BASE_URL

envsubst '${API_BASE_URL}' \
  < /opt/runtime-config.template.js \
  > /usr/share/nginx/html/runtime-config.js
