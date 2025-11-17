#!/bin/sh

pnpm run db:migrate

exec "$@"
