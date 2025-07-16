#!/bin/bash

echo "Initiating nuclear cleanup: Deleting all project-related files except essential setup scripts and READMEs..."

# WARNING: This script is highly destructive and will delete almost all project files.
# Use with extreme caution and only if you intend to completely reset the project
# to a bare minimum state, keeping only setup instructions.

# List of files/directories to KEEP
KEEP_LIST=(
  "scripts/nuclear-cleanup.sh"
  "scripts/complete-setup.sh"
  "scripts/quick-setup.sh"
  "scripts/setup-postgres.sh"
  "scripts/setup-database-quick.sh"
  "scripts/verify-setup.sh"
  "scripts/fix-errors.sh"
  "scripts/fix-font-error.sh"
  "scripts/fix-deployment.sh"
  "scripts/fix-build-errors.sh"
  "scripts/complete-fix.sh"
  "scripts/complete-build-fix.sh"
  "scripts/final-cleanup.sh"
  "scripts/remove-prisma-completely.sh"
  "scripts/ultimate-fix.sh"
  "scripts/fix-user-preferences.sql"
  "scripts/fix-database-tables.sh"
  "scripts/complete-platform-fix.sh"
  "scripts/cleanup-api-routes.sh"
  "scripts/init-database.sql"
  "scripts/complete-schema.sql"
  "scripts/init-database-safe.sql"
  "README.md"
  "SETUP.md"
  ".env.local.example"
  ".git" # Keep git history
)

# Convert to absolute paths for safety
for i in "${!KEEP_LIST[@]}"; do
  KEEP_LIST[$i]="$PWD/${KEEP_LIST[$i]}"
done

# Get all files and directories in the current directory, excluding hidden files like .git
ALL_FILES=()
for item in * .*; do
  if [[ "$item" != "." && "$item" != ".." ]]; then
    ALL_FILES+=("$PWD/$item")
  fi
done

# Iterate through all files and delete if not in KEEP_LIST
for file_path in "${ALL_FILES[@]}"; do
  is_kept=false
  for keep_path in "${KEEP_LIST[@]}"; do
    if [[ "$file_path" == "$keep_path" || "$file_path" == "$keep_path"/* ]]; then
      is_kept=true
      break
    fi
  done

  if ! $is_kept; then
    echo "Deleting: $(basename "$file_path")"
    rm -rf "$file_path"
  fi
done

echo "Nuclear cleanup complete. Most project files have been deleted."
echo "You are left with essential setup scripts and documentation."
echo "To restart, you will need to re-clone the project or generate new code."
