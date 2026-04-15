#!/bin/bash

# Script to apply database indexes for subscription scaling
# This script must be run manually due to CONCURRENTLY limitations

set -e

echo "Applying database indexes for subscription scaling..."

# Get the database URL from .env file
DB_URL=$(grep DATABASE_URL .env | cut -d "=" -f2)

if [ -z "$DB_URL" ]; then
  echo "Error: DATABASE_URL not found in .env file"
  exit 1
fi

echo "Using database URL: $DB_URL"

# Apply the migration
psql "$DB_URL" -f prisma/migrations/20260414_add_subscription_scaling_indexes/migration.sql

echo "Database indexes applied successfully!"
