#!/bin/bash

echo "Cleaning up API routes..."

# Define the directory where API routes are located
API_DIR="app/api"

# List of API routes to keep (add or remove as needed)
# Example: auth routes, health check, AI routes
KEEP_ROUTES=(
  "auth"
  "health"
  "ai"
  "settings"
  "focus-sessions"
  "comprehensive-analysis"
)

# Find all directories under app/api
find "$API_DIR" -mindepth 1 -maxdepth 1 -type d | while read -r dir; do
  dir_name=$(basename "$dir")
  
  # Check if the directory name is in the list of routes to keep
  if [[ ! " ${KEEP_ROUTES[@]} " =~ " ${dir_name} " ]]; then
    echo "Deleting API route: $dir_name"
    rm -rf "$dir"
  else
    echo "Keeping API route: $dir_name"
  fi
done

echo "API route cleanup complete."
