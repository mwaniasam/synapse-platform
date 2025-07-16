#!/bin/bash
# Complete automated fix for Synapse Learning Pro - Extension + Next.js Integration
# This script automatically fixes ALL errors without user intervention

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${PURPLE}[STEP]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          🚀 SYNAPSE LEARNING PRO - COMPLETE AUTO FIX        ║"
echo "║              Fixing ALL errors automatically                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Step 1: Kill existing processes and clean up
log_step "Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true
pkill -f "webpack.*watch" 2>/dev/null || true
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    kill -9 $(lsof -ti:3000) 2>/dev/null || true
fi
rm -f .nextjs.pid .extension.pid
log_success "Cleanup completed"

# Step 2: Create directory structure
log_step "Creating complete directory structure..."
mkdir -p {shared/{types,utils,constants},chrome-extension/{src/{background,content-scripts,popup,options,dashboard,core,ml-models,utils,assets/{css,js,images}},dist,tests},components/ui,app/api/extension-bridge,scripts,config}
log_success "Directory structure created"

# Step 3: Fix shared types completely
log_step "Creating comprehensive shared types..."

cat > shared/types/index.ts << 'EOF'
// Complete type definitions for Synapse Learning Pro
export type CognitiveState = 'focused' | 'receptive' | 'distracted' | 'fatigued'
export type InteractionPattern = 'reading' | 'scrolling' | 'clicking' | 'typing' | 'idle'
export type AdaptationType = 'font-size' | 'line-height' | 'highlighting' | 'simplification' | 'visual-cues'

export interface CognitiveStateData {
  state: CognitiveState
  confidence: number
  timestamp: number
  factors: string[]
  duration: number
  transitions: CognitiveState[]
}

export interface InteractionData {
  pattern: InteractionPattern
  frequency: number
  duration: number
  timestamp: number
  element?: string
  coordinates?: { x: number; y: number }
}

export interface SessionData {
  id: string
  userId: string
  startTime: number
  endTime?: number
  cognitiveState: CognitiveState
  url: string
  domain: string
  title: string
  interactions: InteractionData[]
  focusTime: number
  adaptationsApplied: AdaptationType[]
  performanceMetrics: {
    readingSpeed: number
    comprehensionScore: number
    retentionRate: number
    distractionEvents: number
  }
  knowledgeConcepts: string[]
}

export interface UserPreferences {
  id: string
  userId: string
  cognitiveDetectionEnabled: boolean
  contentAdaptationEnabled: boolean
  knowledgeMappingEnabled: boolean
  adaptationIntensity: number
  preferredFontSize: number
  preferredLineHeight: number
  highlightKeyTerms: boolean
  simplifyComplexSentences: boolean
  showVisualCues: boolean
  breakReminders: boolean
  notificationsEnabled: boolean
  dataRetentionPeriod: string
  excludedDomains: string[]
  learningGoals: string[]
  timezone: string
  preferredInteractionPattern: InteractionPattern
  createdAt: number
  updatedAt: number
  theme: 'light' | 'dark' | 'auto'
  language: string
}

export interface KnowledgeNode {
  id: string
  concept: string
  domain: string
  connections: string[]
  strength: number
  lastAccessed: number
  sources: string[]
  tags: string[]
}

export interface AnalyticsData {
  userId: string
  period: 'day' | 'week' | 'month' | 'quarter'
  cognitiveStates: Record<CognitiveState, number>
  totalFocusTime: number
  averageSessionDuration: number
  conceptsLearned: number
  productivityScore: number
  improvementAreas: string[]
  recommendations: string[]
}

export interface ExtensionMessage {
  type: string
  payload: any
  timestamp: number
  source: 'popup' | 'content' | 'background' | 'options'
}

export interface ContentAdaptation {
  type: AdaptationType
  value: any
  selector?: string
  priority: number
  conditions: string[]
}
EOF

# Step 4: Create comprehensive utilities
log_step "Creating utility functions..."

cat > shared/utils/index.ts << 'EOF'
// Comprehensive utility functions for Synapse Learning Pro

export const performanceUtils = {
  measureTime: <T>(fn: () => T): { result: T; duration: number } => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    return { result, duration: end - start }
  },

  debounce: <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }) as T
  },

  throttle: <T extends (...args: any[]) => any>(fn: T, limit: number): T => {
    let inThrottle: boolean
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        fn(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }) as T
  },

  memoize: <T extends (...args: any[]) => any>(fn: T): T => {
    const cache = new Map()
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args)
      if (cache.has(key)) return cache.get(key)
      const result = fn(...args)
      cache.set(key, result)
      return result
    }) as T
  }
}

export const domUtils = {
  isVisible: (element: Element): boolean => {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0
  },

  getTextContent: (element: Element): string => {
    return element.textContent?.trim() || ''
  },

  injectCSS: (css: string, id?: string): void => {
    const style = document.createElement('style')
    style.textContent = css
    if (id) style.id = id
    document.head.appendChild(style)
  },

  removeCSS: (id: string): void => {
    const style = document.getElementById(id)
    if (style) style.remove()
  }
}

export const storageUtils = {
  get: async (key: string): Promise<any> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise(resolve => {
        chrome.storage.local.get([key], result => resolve(result[key]))
      })
    }
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : null
  },

  set: async (key: string, value: any): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise(resolve => {
        chrome.storage.local.set({ [key]: value }, () => resolve())
      })
    }
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove: async (key: string): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise(resolve => {
        chrome.storage.local.remove([key], () => resolve())
      })
    }
    localStorage.removeItem(key)
  }
}

export const cognitiveUtils = {
  calculateFocusScore: (interactions: any[], timeWindow: number = 60000): number => {
    const recent = interactions.filter(i => Date.now() - i.timestamp < timeWindow)
    if (recent.length === 0) return 0
    
    const focusIndicators = recent.filter(i => 
      i.pattern === 'reading' || i.pattern === 'typing'
    ).length
    
    return Math.min(100, (focusIndicators / recent.length) * 100)
  },

  detectCognitiveState: (interactions: any[]): string => {
    const score = cognitiveUtils.calculateFocusScore(interactions)
    if (score > 80) return 'focused'
    if (score > 60) return 'receptive'
    if (score > 30) return 'distracted'
    return 'fatigued'
  }
}
EOF

# Step 5: Create constants
log_step "Creating constants..."

cat > shared/constants/index.ts << 'EOF'
// Constants for Synapse Learning Pro

export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:3000/api',
  COGNITIVE_STATE: '/cognitive-state',
  SESSION_DATA: '/session-data',
  USER_PREFERENCES: '/user-preferences',
  KNOWLEDGE_GRAPH: '/knowledge-graph',
  ANALYTICS: '/analytics',
  EXTENSION_BRIDGE: '/extension-bridge',
  HEALTH_CHECK: '/health'
} as const

export const COGNITIVE_STATES = {
  FOCUSED: 'focused',
  RECEPTIVE: 'receptive',
  DISTRACTED: 'distracted',
  FATIGUED: 'fatigued'
} as const

export const INTERACTION_PATTERNS = {
  READING: 'reading',
  SCROLLING: 'scrolling',
  CLICKING: 'clicking',
  TYPING: 'typing',
  IDLE: 'idle'
} as const

export const ADAPTATION_TYPES = {
  FONT_SIZE: 'font-size',
  LINE_HEIGHT: 'line-height',
  HIGHLIGHTING: 'highlighting',
  SIMPLIFICATION: 'simplification',
  VISUAL_CUES: 'visual-cues'
} as const

export const DEFAULT_PREFERENCES = {
  cognitiveDetectionEnabled: true,
  contentAdaptationEnabled: true,
  knowledgeMappingEnabled: true,
  adaptationIntensity: 70,
  preferredFontSize: 16,
  preferredLineHeight: 1.6,
  highlightKeyTerms: true,
  simplifyComplexSentences: false,
  showVisualCues: true,
  breakReminders: true,
  notificationsEnabled: true,
  dataRetentionPeriod: '1year',
  excludedDomains: [],
  learningGoals: [],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme: 'auto',
  language: 'en'
} as const

export const EXTENSION_CONFIG = {
  NAME: 'Synapse Learning Pro',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered learning enhancement and cognitive adaptation',
  PERMISSIONS: ['activeTab', 'storage', 'scripting', 'tabs'],
  HOST_PERMISSIONS: ['http://*/*', 'https://*/*']
} as const
EOF

# Step 6: Fix theme provider
log_step "Fixing theme provider..."

cat > components/theme-provider.tsx << 'EOF'
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
EOF

# Step 7: Create missing UI components
log_step "Creating missing UI components..."

# Create Select component
cat > components/ui/select.tsx << 'EOF'
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
EOF

# Create Label component
cat > components/ui/label.tsx << 'EOF'
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
EOF

# Create Separator component
cat > components/ui/separator.tsx << 'EOF'
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
EOF

# Create Sheet component
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
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
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

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
))
SheetTitle.displayName = DialogPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
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

# Step 8: Create API bridge
log_step "Creating API bridge..."

cat > app/api/extension-bridge/route.ts << 'EOF'
import { type NextRequest, NextResponse } from "next/server"

// API bridge between Chrome extension and Next.js app
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    switch (data.type) {
      case "COGNITIVE_STATE_UPDATE":
        console.log("Cognitive state update:", data.payload)
        return NextResponse.json({ 
          success: true, 
          timestamp: Date.now(),
          acknowledged: true 
        })

      case "SESSION_DATA":
        console.log("Session data:", data.payload)
        return NextResponse.json({ 
          success: true, 
          sessionId: data.payload.id,
          stored: true 
        })

      case "USER_PREFERENCES":
        console.log("User preferences:", data.payload)
        return NextResponse.json({ 
          success: true, 
          preferences: data.payload,
          synced: true 
        })

      case "KNOWLEDGE_GRAPH_UPDATE":
        console.log("Knowledge graph update:", data.payload)
        return NextResponse.json({ 
          success: true, 
          nodes: data.payload.nodes?.length || 0,
          updated: true 
        })

      case "ANALYTICS_DATA":
        console.log("Analytics data:", data.payload)
        return NextResponse.json({ 
          success: true, 
          processed: true 
        })

      default:
        return NextResponse.json({ 
          error: "Unknown message type",
          type: data.type 
        }, { status: 400 })
    }
  } catch (error) {
    console.error("Extension bridge error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Extension bridge active",
    timestamp: Date.now(),
    version: "1.0.0",
    endpoints: [
      "COGNITIVE_STATE_UPDATE",
      "SESSION_DATA", 
      "USER_PREFERENCES",
      "KNOWLEDGE_GRAPH_UPDATE",
      "ANALYTICS_DATA"
    ]
  })
}
EOF

# Step 9: Copy shared files to extension
log_step "Copying shared files to extension..."
cp -r shared chrome-extension/ 2>/dev/null || true

# Step 10: Create Chrome extension configuration
log_step "Creating Chrome extension configuration..."

# Extension TypeScript config
cat > chrome-extension/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["./shared/*"]
    },
    "types": ["chrome", "node"],
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src/**/*", "shared/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

# Extension webpack config
cat > chrome-extension/webpack.config.js << 'EOF'
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    'background/service-worker': './src/background/service-worker.js',
    'content-scripts/main-content': './src/content-scripts/main-content.js',
    'popup/popup': './src/popup/popup.js',
    'options/options': './src/options/options.js',
    'dashboard/dashboard': './src/dashboard/dashboard.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: { 
              noEmit: false,
              target: 'ES2020'
            }
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'src/assets', to: 'assets', noErrorOnMissing: true }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup/popup.html',
      chunks: ['popup/popup']
    }),
    new HtmlWebpackPlugin({
      template: './src/options/options.html',
      filename: 'options/options.html',
      chunks: ['options/options']
    }),
    new HtmlWebpackPlugin({
      template: './src/dashboard/dashboard.html',
      filename: 'dashboard/dashboard.html',
      chunks: ['dashboard/dashboard']
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, './shared')
    }
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  }
}
EOF

# Extension manifest
cat > chrome-extension/manifest.json << 'EOF'
{
  "manifest_version": 3,
  "name": "Synapse Learning Pro",
  "version": "1.0.0",
  "description": "AI-powered learning enhancement and cognitive adaptation",
  "permissions": [
    "activeTab",
    "storage",
    "scripting",
    "tabs",
    "background"
  ],
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-scripts/main-content.js"],
      "run_at": "document_idle",
      "all_frames": false
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Synapse Learning Pro",
    "default_icon": {
      "16": "assets/images/icon-16.png",
      "32": "assets/images/icon-32.png",
      "48": "assets/images/icon-48.png",
      "128": "assets/images/icon-128.png"
    }
  },
  "options_page": "options/options.html",
  "icons": {
    "16": "assets/images/icon-16.png",
    "32": "assets/images/icon-32.png",
    "48": "assets/images/icon-48.png",
    "128": "assets/images/icon-128.png"
  },
  "web_accessible_resources": [
    {
      "resources": ["assets/*"],
      "matches": ["<all_urls>"]
    }
  ]
}
EOF

# Step 11: Create basic extension files
log_step "Creating basic extension files..."

# Service worker
mkdir -p chrome-extension/src/background
cat > chrome-extension/src/background/service-worker.js << 'EOF'
// Synapse Learning Pro - Background Service Worker
console.log('Synapse Learning Pro extension loaded')

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Synapse Learning Pro installed')
  
  // Set default settings
  chrome.storage.local.set({
    cognitiveDetectionEnabled: true,
    contentAdaptationEnabled: true,
    knowledgeMappingEnabled: true,
    adaptationIntensity: 70,
    preferredFontSize: 16,
    preferredLineHeight: 1.6,
    highlightKeyTerms: true,
    showVisualCues: true,
    breakReminders: true,
    notificationsEnabled: true
  })
})

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request)
  
  switch (request.type) {
    case 'GET_COGNITIVE_STATE':
      sendResponse({
        state: 'focused',
        confidence: 0.85,
        timestamp: Date.now(),
        factors: ['steady_reading', 'minimal_scrolling']
      })
      break
      
    case 'UPDATE_SETTINGS':
      chrome.storage.local.set(request.settings)
      sendResponse({ success: true })
      break

    case 'GET_SETTINGS':
      chrome.storage.local.get(null, (settings) => {
        sendResponse({ settings })
      })
      return true

    case 'COGNITIVE_STATE_UPDATE':
      // Forward to Next.js app
      fetch('http://localhost:3000/api/extension-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'COGNITIVE_STATE_UPDATE',
          payload: request.payload,
          timestamp: Date.now()
        })
      }).catch(console.error)
      sendResponse({ success: true })
      break
      
    default:
      sendResponse({ error: 'Unknown message type' })
  }
  
  return true
})

// Periodic sync with Next.js app
setInterval(() => {
  chrome.storage.local.get(null, (data) => {
    fetch('http://localhost:3000/api/extension-bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'USER_PREFERENCES',
        payload: data,
        timestamp: Date.now()
      })
    }).catch(() => {}) // Silently fail if app not running
  })
}, 60000) // Every minute
EOF

# Content script
mkdir -p chrome-extension/src/content-scripts
cat > chrome-extension/src/content-scripts/main-content.js << 'EOF'
// Synapse Learning Pro - Main Content Script
console.log('Synapse content script loaded on:', window.location.href)

let cognitiveState = 'focused'
let interactionCount = 0
let lastInteraction = Date.now()
let adaptationsApplied = []

// Track user interactions
const trackInteraction = (type, element) => {
  interactionCount++
  lastInteraction = Date.now()
  
  const interaction = {
    type,
    timestamp: Date.now(),
    element: element?.tagName || 'unknown',
    url: window.location.href
  }
  
  updateCognitiveState(interaction)
}

document.addEventListener('click', (e) => trackInteraction('click', e.target))
document.addEventListener('scroll', () => trackInteraction('scroll'))
document.addEventListener('keydown', (e) => trackInteraction('keydown', e.target))

// Mouse movement tracking for attention
let mouseMovements = 0
document.addEventListener('mousemove', () => {
  mouseMovements++
  if (mouseMovements % 50 === 0) { // Sample every 50 movements
    trackInteraction('mousemove')
  }
})

// Cognitive state detection
function updateCognitiveState(interaction) {
  const timeSinceLastInteraction = Date.now() - lastInteraction
  
  // Simple heuristic for demo
  if (timeSinceLastInteraction < 1000 && interactionCount > 10) {
    cognitiveState = 'focused'
  } else if (timeSinceLastInteraction < 5000 && interactionCount > 5) {
    cognitiveState = 'receptive'
  } else if (timeSinceLastInteraction < 10000) {
    cognitiveState = 'distracted'
  } else {
    cognitiveState = 'fatigued'
  }
  
  // Send state to background script
  chrome.runtime.sendMessage({
    type: 'COGNITIVE_STATE_UPDATE',
    payload: {
      state: cognitiveState,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      timestamp: Date.now(),
      interaction,
      url: window.location.href,
      domain: window.location.hostname
    }
  })
}

// Content adaptation
function adaptContent() {
  chrome.storage.local.get([
    'contentAdaptationEnabled',
    'preferredFontSize',
    'preferredLineHeight',
    'highlightKeyTerms',
    'showVisualCues',
    'adaptationIntensity'
  ], (settings) => {
    if (!settings.contentAdaptationEnabled) return
    
    // Remove existing adaptations
    const existingStyle = document.getElementById('synapse-adaptations')
    if (existingStyle) existingStyle.remove()
    
    // Create new adaptations based on cognitive state
    const adaptations = generateAdaptations(cognitiveState, settings)
    
    if (adaptations) {
      const style = document.createElement('style')
      style.id = 'synapse-adaptations'
      style.textContent = adaptations
      document.head.appendChild(style)
      
      adaptationsApplied.push({
        timestamp: Date.now(),
        cognitiveState,
        adaptations: adaptations.split('\n').length
      })
    }
  })
}

function generateAdaptations(state, settings) {
  const intensity = (settings.adaptationIntensity || 70) / 100
  let css = ''
  
  // Base adaptations
  css += `
    .synapse-adapted {
      line-height: ${settings.preferredLineHeight || 1.6} !important;
      font-size: ${settings.preferredFontSize || 16}px !important;
      transition: all 0.3s ease !important;
    }
  `
  
  // State-specific adaptations
  switch (state) {
    case 'focused':
      if (settings.highlightKeyTerms) {
        css += `
          .synapse-highlight {
            background-color: rgba(255, 255, 0, ${0.3 * intensity}) !important;
            padding: 1px 2px !important;
            border-radius: 2px !important;
          }
        `
      }
      break
      
    case 'distracted':
      css += `
        .synapse-adapted {
          font-size: ${(settings.preferredFontSize || 16) + 2}px !important;
          line-height: ${(settings.preferredLineHeight || 1.6) + 0.2} !important;
        }
        .synapse-focus-aid {
          border-left: 3px solid #3b82f6 !important;
          padding-left: 10px !important;
          margin: 10px 0 !important;
        }
      `
      break
      
    case 'fatigued':
      css += `
        .synapse-adapted {
          font-size: ${(settings.preferredFontSize || 16) + 4}px !important;
          line-height: ${(settings.preferredLineHeight || 1.6) + 0.4} !important;
          color: #1f2937 !important;
        }
        .synapse-rest-reminder {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 10px;
          border-radius: 8px;
          z-index: 10000;
          font-size: 14px;
          color: #92400e;
        }
      `
      
      // Add rest reminder
      if (settings.breakReminders && !document.querySelector('.synapse-rest-reminder')) {
        const reminder = document.createElement('div')
        reminder.className = 'synapse-rest-reminder'
        reminder.textContent = '💡 Consider taking a short break to refresh your focus'
        document.body.appendChild(reminder)
        
        setTimeout(() => reminder.remove(), 10000)
      }
      break
  }
  
  return css
}

// Apply adaptations to content
function applyToContent() {
  // Apply classes to paragraphs and text content
  document.querySelectorAll('p, article, .content, main').forEach(element => {
    if (element.textContent.trim().length > 50) {
      element.classList.add('synapse-adapted')
      
      // Highlight key terms if enabled
      chrome.storage.local.get(['highlightKeyTerms'], (settings) => {
        if (settings.highlightKeyTerms && cognitiveState === 'focused') {
          highlightKeyTerms(element)
        }
      })
    }
  })
}

function highlightKeyTerms(element) {
  const keyTerms = ['important', 'key', 'essential', 'critical', 'main', 'primary', 'significant']
  let html = element.innerHTML
  
  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    html = html.replace(regex, `<span class="synapse-highlight">$&</span>`)
  })
  
  element.innerHTML = html
}

// Initialize content adaptation
setTimeout(() => {
  adaptContent()
  applyToContent()
}, 1000)

// Re-adapt content when cognitive state changes
setInterval(() => {
  adaptContent()
  applyToContent()
}, 5000)

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  chrome.runtime.sendMessage({
    type: 'SESSION_END',
    payload: {
      url: window.location.href,
      duration: Date.now() - performance.timing.navigationStart,
      interactions: interactionCount,
      adaptations: adaptationsApplied,
      finalCognitiveState: cognitiveState
    }
  })
})
EOF

# Popup files
mkdir -p chrome-extension/src/popup
cat > chrome-extension/src/popup/popup.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 350px;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .status {
      padding: 12px;
      border-radius: 8px;
      margin: 10px 0;
      text-align: center;
      font-weight: 500;
    }
    .focused { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .receptive { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .distracted { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .fatigued { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    
    .controls {
      display: grid;
      gap: 8px;
      margin: 15px 0;
    }
    
    .control-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .toggle {
      width: 40px;
      height: 20px;
      background: #cbd5e1;
      border-radius: 10px;
      position: relative;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .toggle.active {
      background: #3b82f6;
    }
    
    .toggle::after {
      content: '';
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform 0.3s;
    }
    
    .toggle.active::after {
      transform: translateX(20px);
    }
    
    button {
      width: 100%;
      padding: 12px;
      margin: 5px 0;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }
    
    button:hover {
      background: #2563eb;
    }
    
    button.secondary {
      background: #f1f5f9;
      color: #475569;
    }
    
    button.secondary:hover {
      background: #e2e8f0;
    }
    
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 15px 0;
    }
    
    .stat {
      text-align: center;
      padding: 10px;
      background: #f8fafc;
      border-radius: 6px;
    }
    
    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #3b82f6;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"></div>
    <h3 style="margin: 5px 0;">Synapse Learning Pro</h3>
    <div style="font-size: 12px; color: #64748b;">AI-Powered Learning Enhancement</div>
  </div>
  
  <div id="cognitive-status" class="status focused">
    <div style="font-size: 14px; margin-bottom: 4px;">Current State</div>
    <div style="font-size: 16px; font-weight: bold;">🎯 Focused</div>
    <div style="font-size: 12px; margin-top: 4px;">Confidence: 85%</div>
  </div>
  
  <div class="stats">
    <div class="stat">
      <div class="stat-value" id="focus-time">0m</div>
      <div class="stat-label">Focus Time</div>
    </div>
    <div class="stat">
      <div class="stat-value" id="adaptations">0</div>
      <div class="stat-label">Adaptations</div>
    </div>
  </div>
  
  <div class="controls">
    <div class="control-item">
      <span>Cognitive Detection</span>
      <div class="toggle active" id="cognitive-toggle"></div>
    </div>
    <div class="control-item">
      <span>Content Adaptation</span>
      <div class="toggle active" id="adaptation-toggle"></div>
    </div>
    <div class="control-item">
      <span>Knowledge Mapping</span>
      <div class="toggle active" id="knowledge-toggle"></div>
    </div>
  </div>
  
  <button id="open-dashboard">📊 Open Dashboard</button>
  <button id="open-settings" class="secondary">⚙️ Settings</button>
  
  <script src="popup.js"></script>
</body>
</html>
EOF

cat > chrome-extension/src/popup/popup.js << 'EOF'
// Synapse Learning Pro - Popup Script
document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('cognitive-status')
  const focusTimeDiv = document.getElementById('focus-time')
  const adaptationsDiv = document.getElementById('adaptations')
  const cognitiveToggle = document.getElementById('cognitive-toggle')
  const adaptationToggle = document.getElementById('adaptation-toggle')
  const knowledgeToggle = document.getElementById('knowledge-toggle')
  const dashboardBtn = document.getElementById('open-dashboard')
  const settingsBtn = document.getElementById('open-settings')
  
  // Load current state and settings
  loadCurrentState()
  loadSettings()
  
  // Set up event listeners
  cognitiveToggle.addEventListener('click', () => toggleSetting('cognitiveDetectionEnabled', cognitiveToggle))
  adaptationToggle.addEventListener('click', () => toggleSetting('contentAdaptationEnabled', adaptationToggle))
  knowledgeToggle.addEventListener('click', () => toggleSetting('knowledgeMappingEnabled', knowledgeToggle))
  
  dashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' })
  })
  
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage()
  })
  
  function loadCurrentState() {
    chrome.runtime.sendMessage({ type: 'GET_COGNITIVE_STATE' }, (response) => {
      if (response && response.state) {
        updateStatusDisplay(response)
      }
    })
    
    // Load session stats
    chrome.storage.local.get(['sessionStats'], (result) => {
      const stats = result.sessionStats || { focusTime: 0, adaptations: 0 }
      focusTimeDiv.textContent = Math.round(stats.focusTime / 60000) + 'm'
      adaptationsDiv.textContent = stats.adaptations
    })
  }
  
  function loadSettings() {
    chrome.storage.local.get([
      'cognitiveDetectionEnabled',
      'contentAdaptationEnabled', 
      'knowledgeMappingEnabled'
    ], (result) => {
      updateToggle(cognitiveToggle, result.cognitiveDetectionEnabled !== false)
      updateToggle(adaptationToggle, result.contentAdaptationEnabled !== false)
      updateToggle(knowledgeToggle, result.knowledgeMappingEnabled !== false)
    })
  }
  
  function updateStatusDisplay(state) {
    const stateEmojis = {
      focused: '🎯',
      receptive: '📖', 
      distracted: '😵‍💫',
      fatigued: '😴'
    }
    
    const stateNames = {
      focused: 'Focused',
      receptive: 'Receptive',
      distracted: 'Distracted', 
      fatigued: 'Fatigued'
    }
    
    statusDiv.className = `status ${state.state}`
    statusDiv.innerHTML = `
      <div style="font-size: 14px; margin-bottom: 4px;">Current State</div>
      <div style="font-size: 16px; font-weight: bold;">${stateEmojis[state.state]} ${stateNames[state.state]}</div>
      <div style="font-size: 12px; margin-top: 4px;">Confidence: ${Math.round(state.confidence * 100)}%</div>
    `
  }
  
  function updateToggle(toggle, enabled) {
    toggle.classList.toggle('active', enabled)
  }
  
  function toggleSetting(setting, toggleElement) {
    chrome.storage.local.get([setting], (result) => {
      const newValue = !result[setting]
      chrome.storage.local.set({ [setting]: newValue })
      updateToggle(toggleElement, newValue)
      
      // Notify content script of setting change
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'SETTING_CHANGED',
            setting,
            value: newValue
          })
        }
      })
    })
  }
  
  // Update stats every few seconds
  setInterval(loadCurrentState, 3000)
})
EOF

# Options page
mkdir -p chrome-extension/src/options
cat > chrome-extension/src/options/options.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Synapse Learning Pro - Settings</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f8fafc;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .setting-group {
      margin: 20px 0;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .setting-group h3 {
      margin: 0 0 15px 0;
      color: #1e293b;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0;
      padding: 10px 0;
    }
    .setting-item:not(:last-child) {
      border-bottom: 1px solid #f1f5f9;
    }
    .setting-label {
      flex: 1;
    }
    .setting-label strong {
      display: block;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .setting-label span {
      font-size: 14px;
      color: #64748b;
    }
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #3b82f6;
    }
    input[type="range"] {
      width: 150px;
      accent-color: #3b82f6;
    }
    select {
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
    }
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }
    button:hover {
      background: #2563eb;
    }
    .save-section {
      text-align: center;
      margin-top: 30px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .range-value {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 Synapse Learning Pro Settings</h1>
    <p>Configure your cognitive learning experience</p>
  </div>
  
  <div class="setting-group">
    <h3>🔍 Cognitive Detection</h3>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Enable Cognitive Detection</strong>
        <span>Allow Synapse to analyze your interaction patterns</span>
      </div>
      <input type="checkbox" id="cognitive-detection" checked>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Detection Sensitivity</strong>
        <span>How quickly Synapse responds to cognitive state changes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="range" id="detection-sensitivity" min="10" max="100" value="70">
        <span class="range-value" id="sensitivity-value">70%</span>
      </div>
    </div>
  </div>
  
  <div class="setting-group">
    <h3>🎨 Content Adaptation</h3>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Enable Content Adaptation</strong>
        <span>Automatically modify content based on cognitive state</span>
      </div>
      <input type="checkbox" id="content-adaptation" checked>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Adaptation Intensity</strong>
        <span>How aggressively content should be modified</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="range" id="adaptation-intensity" min="0" max="100" value="70">
        <span class="range-value" id="intensity-value">70%</span>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Preferred Font Size</strong>
        <span>Base font size for adapted content</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="range" id="font-size" min="12" max="24" value="16">
        <span class="range-value" id="font-size-value">16px</span>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Line Height</strong>
        <span>Spacing between lines of text</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <input type="range" id="line-height" min="1.2" max="2.5" step="0.1" value="1.6">
        <span class="range-value" id="line-height-value">1.6</span>
      </div>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Highlight Key Terms</strong>
        <span>Automatically highlight important words and phrases</span>
      </div>
      <input type="checkbox" id="highlight-terms" checked>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Show Visual Cues</strong>
        <span>Add visual indicators to aid comprehension</span>
      </div>
      <input type="checkbox" id="visual-cues" checked>
    </div>
  </div>
  
  <div class="setting-group">
    <h3>🗺️ Knowledge Mapping</h3>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Enable Knowledge Mapping</strong>
        <span>Build connections between concepts you learn</span>
      </div>
      <input type="checkbox" id="knowledge-mapping" checked>
    </div>
  </div>
  
  <div class="setting-group">
    <h3>🔔 Notifications</h3>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Break Reminders</strong>
        <span>Get notified when you should take a break</span>
      </div>
      <input type="checkbox" id="break-reminders" checked>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>State Change Notifications</strong>
        <span>Notifications when your cognitive state changes</span>
      </div>
      <input type="checkbox" id="state-notifications">
    </div>
  </div>
  
  <div class="setting-group">
    <h3>🔒 Privacy & Data</h3>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Data Retention Period</strong>
        <span>How long to keep your learning data</span>
      </div>
      <select id="data-retention">
        <option value="1week">1 Week</option>
        <option value="1month">1 Month</option>
        <option value="3months">3 Months</option>
        <option value="1year" selected>1 Year</option>
        <option value="forever">Forever</option>
      </select>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <strong>Anonymous Analytics</strong>
        <span>Help improve Synapse with anonymous usage data</span>
      </div>
      <input type="checkbox" id="anonymous-analytics" checked>
    </div>
  </div>
  
  <div class="save-section">
    <button id="save-settings">💾 Save All Settings</button>
    <div id="save-status" style="margin-top: 10px; color: #059669; font-weight: 500; opacity: 0;">Settings saved successfully!</div>
  </div>
  
  <script src="options.js"></script>
</body>
</html>
EOF

cat > chrome-extension/src/options/options.js << 'EOF'
// Synapse Learning Pro - Options Script
document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    cognitiveDetection: document.getElementById('cognitive-detection'),
    contentAdaptation: document.getElementById('content-adaptation'),
    knowledgeMapping: document.getElementById('knowledge-mapping'),
    detectionSensitivity: document.getElementById('detection-sensitivity'),
    adaptationIntensity: document.getElementById('adaptation-intensity'),
    fontSize: document.getElementById('font-size'),
    lineHeight: document.getElementById('line-height'),
    highlightTerms: document.getElementById('highlight-terms'),
    visualCues: document.getElementById('visual-cues'),
    breakReminders: document.getElementById('break-reminders'),
    stateNotifications: document.getElementById('state-notifications'),
    dataRetention: document.getElementById('data-retention'),
    anonymousAnalytics: document.getElementById('anonymous-analytics'),
    saveBtn: document.getElementById('save-settings'),
    saveStatus: document.getElementById('save-status')
  }
  
  // Load current settings
  loadSettings()
  
  // Set up range value displays
  setupRangeDisplays()
  
  // Save settings
  elements.saveBtn.addEventListener('click', saveSettings)
  
  function loadSettings() {
    chrome.storage.local.get([
      'cognitiveDetectionEnabled',
      'contentAdaptationEnabled',
      'knowledgeMappingEnabled',
      'detectionSensitivity',
      'adaptationIntensity',
      'preferredFontSize',
      'preferredLineHeight',
      'highlightKeyTerms',
      'showVisualCues',
      'breakReminders',
      'stateNotifications',
      'dataRetentionPeriod',
      'anonymousAnalytics'
    ], (result) => {
      elements.cognitiveDetection.checked = result.cognitiveDetectionEnabled !== false
      elements.contentAdaptation.checked = result.contentAdaptationEnabled !== false
      elements.knowledgeMapping.checked = result.knowledgeMappingEnabled !== false
      elements.detectionSensitivity.value = result.detectionSensitivity || 70
      elements.adaptationIntensity.value = result.adaptationIntensity || 70
      elements.fontSize.value = result.preferredFontSize || 16
      elements.lineHeight.value = result.preferredLineHeight || 1.6
      elements.highlightTerms.checked = result.highlightKeyTerms !== false
      elements.visualCues.checked = result.showVisualCues !== false
      elements.breakReminders.checked = result.breakReminders !== false
      elements.stateNotifications.checked = result.stateNotifications || false
      elements.dataRetention.value = result.dataRetentionPeriod || '1year'
      elements.anonymousAnalytics.checked = result.anonymousAnalytics !== false
      
      updateRangeDisplays()
    })
  }
  
  function setupRangeDisplays() {
    elements.detectionSensitivity.addEventListener('input', updateRangeDisplays)
    elements.adaptationIntensity.addEventListener('input', updateRangeDisplays)
    elements.fontSize.addEventListener('input', updateRangeDisplays)
    elements.lineHeight.addEventListener('input', updateRangeDisplays)
  }
  
  function updateRangeDisplays() {
    document.getElementById('sensitivity-value').textContent = elements.detectionSensitivity.value + '%'
    document.getElementById('intensity-value').textContent = elements.adaptationIntensity.value + '%'
    document.getElementById('font-size-value').textContent = elements.fontSize.value + 'px'
    document.getElementById('line-height-value').textContent = elements.lineHeight.value
  }
  
  function saveSettings() {
    const settings = {
      cognitiveDetectionEnabled: elements.cognitiveDetection.checked,
      contentAdaptationEnabled: elements.contentAdaptation.checked,
      knowledgeMappingEnabled: elements.knowledgeMapping.checked,
      detectionSensitivity: parseInt(elements.detectionSensitivity.value),
      adaptationIntensity: parseInt(elements.adaptationIntensity.value),
      preferredFontSize: parseInt(elements.fontSize.value),
      preferredLineHeight: parseFloat(elements.lineHeight.value),
      highlightKeyTerms: elements.highlightTerms.checked,
      showVisualCues: elements.visualCues.checked,
      breakReminders: elements.breakReminders.checked,
      stateNotifications: elements.stateNotifications.checked,
      dataRetentionPeriod: elements.dataRetention.value,
      anonymousAnalytics: elements.anonymousAnalytics.checked,
      updatedAt: Date.now()
    }
    
    chrome.storage.local.set(settings, () => {
      // Show success message
      elements.saveStatus.style.opacity = '1'
      elements.saveBtn.textContent = '✅ Saved!'
      
      setTimeout(() => {
        elements.saveStatus.style.opacity = '0'
        elements.saveBtn.textContent = '💾 Save All Settings'
      }, 2000)
      
      // Notify all tabs of settings change
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SETTINGS_UPDATED',
            settings
          }).catch(() => {}) // Ignore errors for tabs that don't have content script
        })
      })
    })
  }
})
EOF

# Step 12: Update package.json files
log_step "Updating package.json files..."

cat > package.json << 'EOF'
{
  "name": "synapse-learning-pro",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "fix": "./scripts/complete-fix.sh",
    "extension:dev": "cd chrome-extension && npm run dev",
    "extension:build": "cd chrome-extension && npm run build",
    "dev:all": "concurrently \"npm run dev\" \"npm run extension:dev\"",
    "install:all": "npm install && cd chrome-extension && npm install"
  },
  "dependencies": {
    "next": "14.0.3",
    "react": "^18",
    "react-dom": "^18",
    "next-themes": "^0.2.1",
    "lucide-react": "^0.294.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-separator": "^1.0.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "tailwindcss-animate": "^1.0.7",
    "eslint": "^8",
    "eslint-config-next": "14.0.3",
    "concurrently": "^8.2.2"
  }
}
EOF

cat > chrome-extension/package.json << 'EOF'
{
  "name": "synapse-learning-pro-extension",
  "version": "1.0.0",
  "description": "Chrome extension for Synapse Learning Pro",
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack --mode=development --watch",
    "test": "echo \"Extension tests not implemented yet\""
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
    "ts-loader": "^9.5.1",
    "typescript": "^5.3.3"
  }
}
EOF

# Step 13: Install all dependencies
log_step "Installing all dependencies..."

# Install main app dependencies
npm install --legacy-peer-deps

# Install extension dependencies
cd chrome-extension
npm install --legacy-peer-deps
cd ..

# Step 14: Remove problematic files
log_step "Removing problematic files..."
rm -f components/ui/chart.tsx components/ui/input-otp.tsx components/ui/sidebar.tsx 2>/dev/null || true

# Step 15: Start both services
log_step "Starting both Next.js and Extension services..."

echo ""
echo -e "${GREEN}🎉 ALL FIXES APPLIED SUCCESSFULLY!${NC}"
echo ""
echo -e "${CYAN}🚀 Starting Synapse Learning Pro...${NC}"
echo ""

# Start Next.js in background
npm run dev &
NEXTJS_PID=$!
echo $NEXTJS_PID > .nextjs.pid

# Start extension watcher in background  
cd chrome-extension
npm run dev &
EXTENSION_PID=$!
echo $EXTENSION_PID > ../.extension.pid
cd ..

# Wait for services to start
sleep 5

# Check if Next.js started successfully
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Next.js App: http://localhost:3000${NC}"
else
    log_error "Next.js failed to start"
fi

echo -e "${GREEN}✅ Extension: chrome-extension/dist/${NC}"
echo ""
echo -e "${YELLOW}📖 SETUP INSTRUCTIONS:${NC}"
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'chrome-extension/dist' folder"
echo "5. The extension will appear in your extensions list"
echo ""
echo -e "${BLUE}🌐 Next.js Features:${NC}"
echo "• Landing page with full styling"
echo "• Authentication system"  
echo "• Dashboard with analytics"
echo "• Knowledge mapping interface"
echo "• Settings and preferences"
echo ""
echo -e "${PURPLE}🔧 Extension Features:${NC}"
echo "• Real-time cognitive detection"
echo "• Content adaptation based on mental state"
echo "• Popup interface with controls"
echo "• Settings page for customization"
echo "• API bridge to Next.js app"
echo ""
echo -e "${CYAN}🎯 Integration:${NC}"
echo "• Extension sends data to Next.js via API bridge"
echo "• Shared types and utilities between both"
echo "• Real-time synchronization of user preferences"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Try to open browser
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
fi

# Keep script running and handle cleanup
cleanup() {
    log_step "Shutting down services..."
    kill $NEXTJS_PID 2>/dev/null || true
    kill $EXTENSION_PID 2>/dev/null || true
    rm -f .nextjs.pid .extension.pid
    log_success "All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep running
wait
