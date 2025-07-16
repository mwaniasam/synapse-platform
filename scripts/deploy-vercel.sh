#!/bin/bash

echo "🚀 Deploying Synapse Learning Pro to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
print_status "Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_status "Please login to Vercel..."
    vercel login
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "🎉 Deployment successful!"
    print_status "Your Synapse Learning Pro app is now live!"
else
    print_error "Deployment failed"
    exit 1
fi
