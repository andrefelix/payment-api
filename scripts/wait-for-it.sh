#!/usr/bin/env sh

set -e

HOST=$1
PORT=$2
shift 2

TIMEOUT=30

echo "Waiting for $HOST:$PORT..."

for i in $(seq $TIMEOUT); do
  nc -z "$HOST" "$PORT" 2>/dev/null && break
  sleep 1
done

if ! nc -z "$HOST" "$PORT" 2>/dev/null; then
  echo "Timeout waiting for $HOST:$PORT"
  exit 1
fi

echo "$HOST:$PORT is available!"

exec "$@"

