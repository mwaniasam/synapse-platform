#!/bin/bash

# Synapse Learning Pro - Complete Setup and Testing Script
# This script sets up the entire development environment and launches the app for testing

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Check if running on supported OS
check_os() {
    log_step "Checking operating system compatibility..."
    
    case "$OSTYPE" in
        linux*)   OS="Linux" ;;
        darwin*)  OS="macOS" ;;
        msys*)    OS="Windows" ;;
        cygwin*)  OS="Windows" ;;
        *)        log_error "Unsupported operating system: $OSTYPE" && exit 1 ;;
    esac
    
    log_success "Running on $OS"
}

# Check if required tools are installed
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    log_success "Node.js $(node --version) is installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_success "npm $(npm --version) is installed"
    
    # Check Git
    if ! command -v git &> /dev/null; then
        log_warning "Git is not installed. Some features may not work properly."
    else
        log_success "Git $(git --version | cut -d' ' -f3) is installed"
    fi
    
    # Check Chrome/Chromium for extension testing
    if command -v google-chrome &> /dev/null; then
        CHROME_PATH="google-chrome"
        log_success "Google Chrome is available for extension testing"
    elif command -v chromium &> /dev/null; then
        CHROME_PATH="chromium"
        log_success "Chromium is available for extension testing"
    elif command -v chrome &> /dev/null; then
        CHROME_PATH="chrome"
        log_success "Chrome is available for extension testing"
    else
        log_warning "Chrome/Chromium not found. Extension testing may not work."
        CHROME_PATH=""
    fi
}

# Install global dependencies
install_global_dependencies() {
    log_step "Installing global dependencies..."
    
    # Install global packages if not already installed
    if ! npm list -g concurrently &> /dev/null; then
        log_info "Installing concurrently globally..."
        npm install -g concurrently
    fi
    
    if ! npm list -g web-ext &> /dev/null; then
        log_info "Installing web-ext for extension development..."
        npm install -g web-ext
    fi
    
    log_success "Global dependencies installed"
}

# Setup project structure
setup_project_structure() {
    log_step "Setting up project structure..."
    
    # Create main directories if they don't exist
    mkdir -p {chrome-extension/{src/{background,content-scripts,popup,options,dashboard,core,ml-models,utils,assets/{css,js,images}},dist,tests},shared/{types,constants,utils},docs/{extension,api,user-guide},tests/{unit,integration,e2e},scripts,config}
    
    log_success "Project structure created"
}

# Install Next.js app dependencies
install_nextjs_dependencies() {
    log_step "Installing Next.js application dependencies..."
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Install dependencies
    log_info "Installing Next.js dependencies..."
    npm install --legacy-peer-deps
    
    # Install additional dependencies for the complete app
    log_info "Installing additional dependencies..."
    npm install --save --legacy-peer-deps \
        @radix-ui/react-avatar \
        @radix-ui/react-badge \
        @radix-ui/react-dropdown-menu \
        @radix-ui/react-sheet \
        @radix-ui/react-slider \
        @radix-ui/react-switch \
        @radix-ui/react-tabs \
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
        puppeteer \
        eslint-plugin-chrome-extension \
        webpack \
        webpack-cli \
        copy-webpack-plugin \
        html-webpack-plugin \
        css-loader \
        style-loader
    
    log_success "Next.js dependencies installed"
}

# Install Chrome extension dependencies
install_extension_dependencies() {
    log_step "Installing Chrome extension dependencies..."
    
    # Create package.json for extension if it doesn't exist
    if [ ! -f "chrome-extension/package.json" ]; then
        log_info "Creating Chrome extension package.json..."
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
    "eslint": "^8.53.0",
    "eslint-plugin-chrome-extension": "^2.0.0"
  }
}
EOF
    fi
    
    # Install extension dependencies
    cd chrome-extension
    log_info "Installing extension dependencies..."
    npm install
    cd ..
    
    log_success "Chrome extension dependencies installed"
}

# Create essential configuration files
create_config_files() {
    log_step "Creating configuration files..."
    
    # Create webpack config for extension
    if [ ! -f "chrome-extension/webpack.config.js" ]; then
        log_info "Creating webpack configuration..."
        cat > chrome-extension/webpack.config.js << 'EOF'
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
        { from: 'src/assets', to: 'assets' }
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
    alias: {
      '@shared': path.resolve(__dirname, '../shared')
    }
  }
};
EOF
    fi
    
    # Create Jest config
    if [ ! -f "jest.config.js" ]; then
        log_info "Creating Jest configuration..."
        cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'chrome-extension/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts'
  ]
};
EOF
    fi
    
    # Create Jest setup file
    if [ ! -f "jest.setup.js" ]; then
        cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom';

// Mock Chrome APIs for testing
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};
EOF
    fi
    
    # Create ESLint config
    if [ ! -f ".eslintrc.js" ]; then
        log_info "Creating ESLint configuration..."
        cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:chrome-extension/recommended'
  ],
  plugins: ['chrome-extension'],
  rules: {
    'chrome-extension/no-browser-api-in-content-script': 'error'
  },
  env: {
    browser: true,
    node: true,
    webextensions: true
  }
};
EOF
    fi
    
    log_success "Configuration files created"
}

# Create environment files
create_environment_files() {
    log_step "Creating environment files..."
    
    # Create .env.local for Next.js
    if [ ! -f ".env.local" ]; then
        log_info "Creating .env.local file..."
        cat > .env.local << 'EOF'
# Synapse Learning Pro Environment Variables
NEXT_PUBLIC_APP_NAME="Synapse Learning Pro"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_EXTENSION_ID="your-extension-id-here"

# Development settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true

# Database (if using)
# DATABASE_URL="your-database-url-here"

# Authentication (if using external providers)
# NEXTAUTH_SECRET="your-secret-here"
# NEXTAUTH_URL="http://localhost:3000"
EOF
    fi
    
    # Create .env.example
    if [ ! -f ".env.example" ]; then
        cp .env.local .env.example
        log_info "Created .env.example file"
    fi
    
    log_success "Environment files created"
}

# Build the Chrome extension
build_extension() {
    log_step "Building Chrome extension..."
    
    cd chrome-extension
    
    # Create basic manifest.json if it doesn't exist
    if [ ! -f "manifest.json" ]; then
        log_info "Creating manifest.json..."
        cat > manifest.json << 'EOF'
{
  "manifest_version": 3,
  "name": "Synapse Learning Pro",
  "version": "1.0.0",
  "description": "AI-powered learning enhancement and cognitive adaptation",
  "permissions": [
    "activeTab",
    "storage",
    "scripting",
    "tabs"
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
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Synapse Learning Pro"
  },
  "options_page": "options/options.html",
  "icons": {
    "16": "assets/images/icon-16.png",
    "32": "assets/images/icon-32.png",
    "48": "assets/images/icon-48.png",
    "128": "assets/images/icon-128.png"
  }
}
EOF
    fi
    
    # Create basic extension files if they don't exist
    create_basic_extension_files
    
    # Build the extension
    log_info "Building extension with webpack..."
    npm run build
    
    cd ..
    
    log_success "Chrome extension built successfully"
}

# Create basic extension files for initial testing
create_basic_extension_files() {
    log_info "Creating basic extension files..."
    
    # Create basic service worker
    mkdir -p src/background
    if [ ! -f "src/background/service-worker.js" ]; then
        cat > src/background/service-worker.js << 'EOF'
// Synapse Learning Pro - Background Service Worker
console.log('Synapse Learning Pro extension loaded');

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Synapse Learning Pro installed');
  
  // Set default settings
  chrome.storage.local.set({
    cognitiveDetectionEnabled: true,
    contentAdaptationEnabled: true,
    knowledgeMappingEnabled: true
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  switch (request.type) {
    case 'GET_COGNITIVE_STATE':
      // Return mock cognitive state for testing
      sendResponse({
        state: 'focused',
        confidence: 0.85,
        timestamp: Date.now()
      });
      break;
      
    case 'UPDATE_SETTINGS':
      chrome.storage.local.set(request.settings);
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
  
  return true; // Keep message channel open for async response
});
EOF
    fi
    
    # Create basic content script
    mkdir -p src/content-scripts
    if [ ! -f "src/content-scripts/main-content.js" ]; then
        cat > src/content-scripts/main-content.js << 'EOF'
// Synapse Learning Pro - Main Content Script
console.log('Synapse content script loaded on:', window.location.href);

// Initialize cognitive detection
let cognitiveState = 'focused';
let interactionCount = 0;

// Track user interactions
document.addEventListener('click', () => {
  interactionCount++;
  updateCognitiveState();
});

document.addEventListener('scroll', () => {
  interactionCount++;
  updateCognitiveState();
});

// Simple cognitive state detection (mock implementation)
function updateCognitiveState() {
  // Simple heuristic for demo purposes
  if (interactionCount > 10) {
    cognitiveState = 'focused';
  } else if (interactionCount > 5) {
    cognitiveState = 'receptive';
  } else {
    cognitiveState = 'distracted';
  }
  
  // Send state to background script
  chrome.runtime.sendMessage({
    type: 'COGNITIVE_STATE_UPDATE',
    state: cognitiveState,
    timestamp: Date.now()
  });
}

// Apply basic content adaptation
function adaptContent() {
  chrome.storage.local.get(['contentAdaptationEnabled'], (result) => {
    if (result.contentAdaptationEnabled) {
      // Apply basic styling based on cognitive state
      const style = document.createElement('style');
      style.textContent = `
        .synapse-adapted {
          line-height: 1.6 !important;
          font-size: 16px !important;
        }
        .synapse-highlight {
          background-color: yellow !important;
          padding: 2px !important;
        }
      `;
      document.head.appendChild(style);
      
      // Add classes to paragraphs
      document.querySelectorAll('p').forEach(p => {
        p.classList.add('synapse-adapted');
      });
    }
  });
}

// Initialize content adaptation
setTimeout(adaptContent, 1000);
EOF
    fi
    
    # Create basic popup
    mkdir -p src/popup
    if [ ! -f "src/popup/popup.html" ]; then
        cat > src/popup/popup.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 300px;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
      padding: 10px;
      border-radius: 8px;
      margin: 10px 0;
      text-align: center;
    }
    .focused { background: #dcfce7; color: #166534; }
    .receptive { background: #dbeafe; color: #1e40af; }
    .distracted { background: #fef3c7; color: #92400e; }
    .fatigued { background: #fee2e2; color: #991b1b; }
    button {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"></div>
    <h3>Synapse Learning Pro</h3>
  </div>
  
  <div id="cognitive-status" class="status focused">
    Cognitive State: <strong>Focused</strong>
  </div>
  
  <button id="toggle-adaptation">Toggle Content Adaptation</button>
  <button id="open-dashboard">Open Dashboard</button>
  <button id="open-settings">Settings</button>
  
  <script src="popup.js"></script>
</body>
</html>
EOF
    fi
    
    if [ ! -f "src/popup/popup.js" ]; then
        cat > src/popup/popup.js << 'EOF'
// Synapse Learning Pro - Popup Script
document.addEventListener('DOMContentLoaded', () => {
  const statusDiv = document.getElementById('cognitive-status');
  const toggleBtn = document.getElementById('toggle-adaptation');
  const dashboardBtn = document.getElementById('open-dashboard');
  const settingsBtn = document.getElementById('open-settings');
  
  // Get current cognitive state
  chrome.runtime.sendMessage({ type: 'GET_COGNITIVE_STATE' }, (response) => {
    if (response && response.state) {
      statusDiv.textContent = `Cognitive State: ${response.state}`;
      statusDiv.className = `status ${response.state}`;
    }
  });
  
  // Toggle content adaptation
  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get(['contentAdaptationEnabled'], (result) => {
      const newState = !result.contentAdaptationEnabled;
      chrome.storage.local.set({ contentAdaptationEnabled: newState });
      toggleBtn.textContent = newState ? 'Disable Content Adaptation' : 'Enable Content Adaptation';
    });
  });
  
  // Open dashboard
  dashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'dashboard/dashboard.html' });
  });
  
  // Open settings
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
EOF
    fi
    
    # Create basic options page
    mkdir -p src/options
    if [ ! -f "src/options/options.html" ]; then
        cat > src/options/options.html << 'EOF'
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
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .setting-group {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Synapse Learning Pro Settings</h1>
    <p>Configure your cognitive learning experience</p>
  </div>
  
  <div class="setting-group">
    <h3>Cognitive Detection</h3>
    <div class="setting-item">
      <label>Enable Cognitive Detection</label>
      <input type="checkbox" id="cognitive-detection" checked>
    </div>
  </div>
  
  <div class="setting-group">
    <h3>Content Adaptation</h3>
    <div class="setting-item">
      <label>Enable Content Adaptation</label>
      <input type="checkbox" id="content-adaptation" checked>
    </div>
  </div>
  
  <div class="setting-group">
    <h3>Knowledge Mapping</h3>
    <div class="setting-item">
      <label>Enable Knowledge Mapping</label>
      <input type="checkbox" id="knowledge-mapping" checked>
    </div>
  </div>
  
  <button id="save-settings">Save Settings</button>
  
  <script src="options.js"></script>
</body>
</html>
EOF
    fi
    
    if [ ! -f "src/options/options.js" ]; then
        cat > src/options/options.js << 'EOF'
// Synapse Learning Pro - Options Script
document.addEventListener('DOMContentLoaded', () => {
  const cognitiveDetection = document.getElementById('cognitive-detection');
  const contentAdaptation = document.getElementById('content-adaptation');
  const knowledgeMapping = document.getElementById('knowledge-mapping');
  const saveBtn = document.getElementById('save-settings');
  
  // Load current settings
  chrome.storage.local.get([
    'cognitiveDetectionEnabled',
    'contentAdaptationEnabled',
    'knowledgeMappingEnabled'
  ], (result) => {
    cognitiveDetection.checked = result.cognitiveDetectionEnabled !== false;
    contentAdaptation.checked = result.contentAdaptationEnabled !== false;
    knowledgeMapping.checked = result.knowledgeMappingEnabled !== false;
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      cognitiveDetectionEnabled: cognitiveDetection.checked,
      contentAdaptationEnabled: contentAdaptation.checked,
      knowledgeMappingEnabled: knowledgeMapping.checked
    }, () => {
      // Show success message
      saveBtn.textContent = 'Settings Saved!';
      setTimeout(() => {
        saveBtn.textContent = 'Save Settings';
      }, 2000);
    });
  });
});
EOF
    fi
    
    # Create basic dashboard
    mkdir -p src/dashboard
    if [ ! -f "src/dashboard/dashboard.html" ]; then
        cat > src/dashboard/dashboard.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Synapse Learning Pro - Dashboard</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f9fafb;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #3b82f6;
    }
    .chart-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Synapse Learning Pro Dashboard</h1>
    <p>Your cognitive learning analytics</p>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <h3>Focus Sessions</h3>
      <div class="stat-value">12</div>
      <p>This week</p>
    </div>
    <div class="stat-card">
      <h3>Learning Time</h3>
      <div class="stat-value">8.5h</div>
      <p>Total this week</p>
    </div>
    <div class="stat-card">
      <h3>Concepts Learned</h3>
      <div class="stat-value">24</div>
      <p>New concepts</p>
    </div>
    <div class="stat-card">
      <h3>Productivity Score</h3>
      <div class="stat-value">85%</div>
      <p>Above average</p>
    </div>
  </div>
  
  <div class="chart-container">
    <h3>Cognitive State Trends</h3>
    <div id="cognitive-chart" style="height: 300px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
      Chart visualization will be implemented here
    </div>
  </div>
  
  <script src="dashboard.js"></script>
</body>
</html>
EOF
    fi
    
    if [ ! -f "src/dashboard/dashboard.js" ]; then
        cat > src/dashboard/dashboard.js << 'EOF'
// Synapse Learning Pro - Dashboard Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('Synapse Dashboard loaded');
  
  // Load dashboard data
  loadDashboardData();
});

function loadDashboardData() {
  // Mock data for demonstration
  const mockData = {
    focusSessions: 12,
    learningTime: '8.5h',
    conceptsLearned: 24,
    productivityScore: '85%'
  };
  
  // Update stats (in a real implementation, this would come from storage)
  console.log('Dashboard data loaded:', mockData);
}
EOF
    fi
    
    # Create basic assets
    mkdir -p src/assets/images
    # Note: In a real implementation, you would add actual icon files here
    
    log_success "Basic extension files created"
}

# Start development servers
start_development_servers() {
    log_step "Starting development servers..."
    
    # Check if port 3000 is available
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        log_warning "Port 3000 is already in use. Stopping existing process..."
        kill -9 $(lsof -ti:3000) 2>/dev/null || true
        sleep 2
    fi
    
    # Start Next.js development server
    log_info "Starting Next.js development server..."
    npm run dev &
    NEXTJS_PID=$!
    
    # Wait for Next.js to start
    log_info "Waiting for Next.js server to start..."
    sleep 5
    
    # Check if Next.js started successfully
    if curl -s http://localhost:3000 > /dev/null; then
        log_success "Next.js server started successfully at http://localhost:3000"
    else
        log_error "Failed to start Next.js server"
        kill $NEXTJS_PID 2>/dev/null || true
        exit 1
    fi
    
    # Start extension development watcher
    log_info "Starting Chrome extension development watcher..."
    cd chrome-extension
    npm run dev &
    EXTENSION_PID=$!
    cd ..
    
    log_success "Development servers started"
    
    # Store PIDs for cleanup
    echo $NEXTJS_PID > .nextjs.pid
    echo $EXTENSION_PID > .extension.pid
}

# Open browser for testing
open_browser_for_testing() {
    log_step "Opening browser for testing..."
    
    # Wait a moment for servers to fully initialize
    sleep 3
    
    # Open Next.js app
    if command -v open &> /dev/null; then
        # macOS
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open http://localhost:3000
    elif command -v start &> /dev/null; then
        # Windows
        start http://localhost:3000
    else
        log_info "Please open http://localhost:3000 in your browser"
    fi
    
    log_success "Browser opened for testing"
}

# Load Chrome extension for testing
load_chrome_extension() {
    log_step "Instructions for loading Chrome extension..."
    
    echo ""
    log_info "To load the Chrome extension for testing:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' (toggle in top right)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'chrome-extension/dist' folder"
    echo "5. The extension should now appear in your extensions list"
    echo ""
    log_info "Extension files are located at: $(pwd)/chrome-extension/dist"
    
    # Try to open Chrome extensions page
    if [ -n "$CHROME_PATH" ]; then
        log_info "Opening Chrome extensions page..."
        $CHROME_PATH --new-tab chrome://extensions/ 2>/dev/null &
    fi
}

# Run tests
run_tests() {
    log_step "Running tests..."
    
    log_info "Running Next.js tests..."
    npm test -- --passWithNoTests --watchAll=false
    
    log_info "Running extension tests..."
    cd chrome-extension
    npm test -- --passWithNoTests --watchAll=false
    cd ..
    
    log_success "Tests completed"
}

# Display usage instructions
show_usage_instructions() {
    log_step "Usage Instructions"
    
    echo ""
    echo -e "${CYAN}🚀 Synapse Learning Pro is now running!${NC}"
    echo ""
    echo -e "${GREEN}Next.js Web App:${NC}"
    echo "  • URL: http://localhost:3000"
    echo "  • Features: Landing page, authentication, dashboard, analytics"
    echo ""
    echo -e "${GREEN}Chrome Extension:${NC}"
    echo "  • Location: chrome-extension/dist/"
    echo "  • Load in Chrome: chrome://extensions/ → Load unpacked"
    echo "  • Features: Cognitive detection, content adaptation, popup interface"
    echo ""
    echo -e "${GREEN}Development Commands:${NC}"
    echo "  • npm run dev          - Start Next.js development server"
    echo "  • npm run build        - Build Next.js for production"
    echo "  • npm test             - Run tests"
    echo "  • npm run lint         - Run linting"
    echo ""
    echo -e "${GREEN}Extension Commands:${NC}"
    echo "  • cd chrome-extension && npm run dev   - Watch extension files"
    echo "  • cd chrome-extension && npm run build - Build extension"
    echo "  • cd chrome-extension && npm test      - Test extension"
    echo ""
    echo -e "${YELLOW}Testing Workflow:${NC}"
    echo "1. Open http://localhost:3000 and create an account"
    echo "2. Load the Chrome extension in chrome://extensions/"
    echo "3. Browse any website to test cognitive detection"
    echo "4. Click the extension icon to see the popup"
    echo "5. Visit the dashboard to see analytics (mock data)"
    echo ""
    echo -e "${YELLOW}Stopping Servers:${NC}"
    echo "  • Press Ctrl+C to stop this script"
    echo "  • Or run: ./scripts/stop-servers.sh"
    echo ""
}

# Cleanup function
cleanup() {
    log_step "Cleaning up..."
    
    # Kill development servers
    if [ -f .nextjs.pid ]; then
        NEXTJS_PID=$(cat .nextjs.pid)
        kill $NEXTJS_PID 2>/dev/null || true
        rm .nextjs.pid
    fi
    
    if [ -f .extension.pid ]; then
        EXTENSION_PID=$(cat .extension.pid)
        kill $EXTENSION_PID 2>/dev/null || true
        rm .extension.pid
    fi
    
    log_success "Cleanup completed"
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
main() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                 Synapse Learning Pro Setup                  ║"
    echo "║              Complete Development Environment                ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_os
    check_prerequisites
    install_global_dependencies
    setup_project_structure
    install_nextjs_dependencies
    install_extension_dependencies
    create_config_files
    create_environment_files
    build_extension
    start_development_servers
    open_browser_for_testing
    load_chrome_extension
    
    # Optional: Run tests
    read -p "Do you want to run tests? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_tests
    fi
    
    show_usage_instructions
    
    # Keep script running
    log_info "Press Ctrl+C to stop all servers and exit"
    wait
}

# Run main function
main "$@"
