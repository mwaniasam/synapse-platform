#!/bin/bash

# Quick start script for Synapse Learning Pro
# This script assumes dependencies are already installed

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Quick Starting Synapse Learning Pro...${NC}"

# Start Next.js in background
echo -e "${GREEN}Starting Next.js server...${NC}"
npm run dev &
NEXTJS_PID=$!
echo $NEXTJS_PID > .nextjs.pid

# Start extension watcher in background
echo -e "${GREEN}Starting extension watcher...${NC}"
cd chrome-extension
npm run dev &
EXTENSION_PID=$!
echo $EXTENSION_PID > ../.extension.pid
cd ..

# Wait for servers to start
sleep 5

echo -e "${GREEN}✅ Servers started!${NC}"
echo "Next.js: http://localhost:3000"
echo "Extension: chrome-extension/dist/"
echo ""
echo "Press Ctrl+C to stop servers"

# Keep script running
wait
