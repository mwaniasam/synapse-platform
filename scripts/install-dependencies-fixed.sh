#!/bin/bash

# Synapse Learning Pro - Fixed Dependency Installation Script
# This script installs all required dependencies with verified package names

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

log_info "Installing Synapse Learning Pro dependencies with verified package names..."

# Install Next.js dependencies first
log_info "Installing Next.js dependencies..."
npm install --legacy-peer-deps

# Install Radix UI components (verified package names only)
log_info "Installing verified Radix UI components..."
npm install --save --legacy-peer-deps \
    @radix-ui/react-avatar \
    @radix-ui/react-dropdown-menu \
    @radix-ui/react-dialog \
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

# Install development dependencies
log_info "Installing development dependencies..."
npm install --save-dev --legacy-peer-deps \
    @types/chrome \
    jest \
    @testing-library/react \
    @testing-library/jest-dom \
    jest-environment-jsdom \
    webpack \
    webpack-cli \
    copy-webpack-plugin \
    html-webpack-plugin \
    css-loader \
    style-loader

log_success "Next.js dependencies installed successfully!"

# Create Chrome extension package.json
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
    "lint": "eslint src/"
  },
  "dependencies": {
    "chart.js": "^4.4.0"
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

# Create missing UI components
log_info "Creating missing UI components..."

# Create Sheet component (since @radix-ui/react-sheet doesn't exist)
mkdir -p components/ui
cat > components/ui/sheet.tsx << 'EOF'
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from 'lucide-react'

import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root

const SheetTrigger = DialogPrimitive.Trigger

const SheetClose = DialogPrimitive.Close

const SheetPortal = DialogPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = DialogPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = DialogPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
EOF

log_success "Missing UI components created!"
log_success "Setup complete! You can now run 'npm run dev' to start the development server."
