#!/bin/bash

# Stop all Synapse Learning Pro development servers

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Stopping Synapse Learning Pro development servers..."

# Kill processes by PID files
if [ -f .nextjs.pid ]; then
    NEXTJS_PID=$(cat .nextjs.pid)
    if kill $NEXTJS_PID 2>/dev/null; then
        log_success "Stopped Next.js server (PID: $NEXTJS_PID)"
    else
        log_error "Failed to stop Next.js server or process not found"
    fi
    rm .nextjs.pid
fi

if [ -f .extension.pid ]; then
    EXTENSION_PID=$(cat .extension.pid)
    if kill $EXTENSION_PID 2>/dev/null; then
        log_success "Stopped extension watcher (PID: $EXTENSION_PID)"
    else
        log_error "Failed to stop extension watcher or process not found"
    fi
    rm .extension.pid
fi

# Kill any remaining processes on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    log_info "Killing remaining processes on port 3000..."
    kill -9 $(lsof -ti:3000) 2>/dev/null || true
    log_success "Port 3000 cleared"
fi

# Kill any Node.js processes related to the project
pkill -f "next dev" 2>/dev/null || true
pkill -f "webpack.*watch" 2>/dev/null || true

log_success "All servers stopped"
