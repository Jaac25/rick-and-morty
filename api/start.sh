#!/bin/sh

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Starting server..."
node dist/server.js