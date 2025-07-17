#!/bin/bash

# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Optional: Seed the database
npx prisma db seed
