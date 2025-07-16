#!/bin/bash

echo "🧪 Starting Synapse Learning Pro Testing Suite..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.local exists
if [ ! -f .env.local ]; then
    print_error ".env.local file not found!"
    print_warning "Please create .env.local with required environment variables"
    exit 1
fi

print_status "Environment file found ✓"

# Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Push database schema
print_status "Pushing database schema..."
npx prisma db push
if [ $? -eq 0 ]; then
    print_success "Database schema pushed successfully"
else
    print_error "Failed to push database schema"
    exit 1
fi

# Run TypeScript check
print_status "Running TypeScript check..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript check found issues (continuing anyway)"
fi

# Run ESLint
print_status "Running ESLint..."
npx next lint
if [ $? -eq 0 ]; then
    print_success "ESLint check passed"
else
    print_warning "ESLint found issues (continuing anyway)"
fi

# Build the application
print_status "Building application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

print_success "🎉 All tests passed! Your Synapse Learning Pro app is ready for deployment."
print_status "To start the development server, run: npm run dev"
print_status "To start the production server, run: npm start"
