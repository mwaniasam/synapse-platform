#!/bin/bash

echo "Setting up PostgreSQL database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  echo "Please set it to your Neon PostgreSQL connection string."
  exit 1
fi

# This script assumes you have PostgreSQL installed and accessible.
# It will create a database and a user for your application.

DB_NAME="synapse_db"
DB_USER="synapse_user"
DB_PASSWORD="synapse_password" # Consider using a more secure method for production

echo "Creating PostgreSQL database and user..."

# Create database user
# The -w flag prompts for a password, but we're passing it directly for scripting.
# In a real scenario, avoid hardcoding passwords.
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Create database and grant privileges
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "Database '$DB_NAME' and user '$DB_USER' created successfully."
echo "Remember to update your .env.local with the following:"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\""
echo "DIRECT_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\""

# Install Prisma if not already installed
if ! command -v prisma &> /dev/null
then
    echo "Prisma CLI not found. Installing it globally..."
    npm install -g prisma
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

if [ $? -ne 0 ]; then
  echo "Prisma migrate deploy failed. Please check your DATABASE_URL and network connection."
  exit 1
fi

echo "Seeding database with initial data..."
npx tsx prisma/seed.ts

if [ $? -ne 0 ]; then
  echo "Database seeding failed. Check your seed script or data."
  exit 1
fi

echo "PostgreSQL setup complete!"
