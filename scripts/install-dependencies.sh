#!/bin/bash

# Synapse Learning Pro - Dependency Installation Script
# This script installs all required dependencies with correct package names

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Installing Synapse Learning Pro dependencies..."

# Install Next.js dependencies first
log_info "Installing Next.js dependencies..."
npm install --legacy-peer-deps

# Install Radix UI components (correct package names)
log_info "Installing Radix UI components..."
npm install --save --legacy-peer-deps \
    @radix-ui/react-avatar \
    @radix-ui/react-dropdown-menu \
    @radix-ui/react-sheet \
    @radix-ui/react-slider \
    @radix-ui/react-switch \
    @radix-ui/react-tabs \
    @radix-ui/react-select \
    @radix-ui/react-label \
    @radix-ui/react-separator

# Install other UI and utility libraries
log_info "Installing additional libraries..."
npm install --save --legacy-peer-deps \
    recharts \
    "date-fns@^2.30.0" \
    framer-motion \
    react-hook-form \
    zod \
    @hookform/resolvers

# Install development dependencies (correct package names)
log_info "Installing development dependencies..."
npm install --save-dev --legacy-peer-deps \
    @types/chrome \
    jest \
    @testing-library/react \
    @testing-library/jest-dom \
    jest-environment-jsdom \
    puppeteer \
    webpack \
    webpack-cli \
    copy-webpack-plugin \
    html-webpack-plugin \
    css-loader \
    style-loader

log_success "Next.js dependencies installed successfully!"

# Create Chrome extension package.json with correct dependencies
log_info "Setting up Chrome extension dependencies..."

mkdir -p chrome-extension

cat > chrome-extension/package.json << 'EOF'
{
  "name": "synapse-learning-pro-extension",
  "version": "1.0.0",
  "description": "Chrome extension for Synapse Learning Pro",
  "main": "src/background/service-worker.js",
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack --mode=development --watch",
    "test": "jest",
    "lint": "eslint src/",
    "package": "web-ext build --source-dir=dist"
  },
  "dependencies": {
    "compromise": "^14.10.0",
    "ml-matrix": "^6.10.4",
    "chart.js": "^4.4.0",
    "d3": "^7.8.5"
  },
  "devDependencies": {
    "@types/chrome": "^0.0.246",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "copy-webpack-plugin": "^11.0.0",
    "html-webpack-plugin": "^5.5.3",
    "css-loader": "^6.8.1",
    "style-loader": "^3.3.3",
    "jest": "^29.7.0",
    "eslint": "^8.53.0"
  }
}
EOF

# Install Chrome extension dependencies
cd chrome-extension
log_info "Installing Chrome extension dependencies..."
npm install --legacy-peer-deps
cd ..

log_success "All dependencies installed successfully!"
