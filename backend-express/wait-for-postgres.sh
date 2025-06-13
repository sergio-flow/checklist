#!/bin/sh

echo "Waiting for postgres at $1:$2..."

while ! nc -z $1 $2; do
  sleep 1
done

echo "Postgres is up!"
