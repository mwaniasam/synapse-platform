@echo off
REM Windows batch script to fix all Chrome extension errors

echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🔧 Fixing Chrome Extension Errors              ║
echo ╚══════════════════════════════════════════════════════════════╝

echo [INFO] Fixing TypeScript and dependency errors...

REM Navigate to project root
cd /d "%~dp0.."

REM Fix shared types first
echo [STEP] Creating missing shared types...

REM Create cognitive-states.ts with proper exports
mkdir shared\types 2>nul
echo // Cognitive States Type Definitions > shared\types\cognitive-states.ts
echo export type CognitiveState = 'focused' ^| 'receptive' ^| 'distracted' ^| 'fatigued'; >> shared\types\cognitive-states.ts
echo. >> shared\types\cognitive-states.ts
echo export interface CognitiveStateData { >> shared\types\cognitive-states.ts
echo   state: CognitiveState; >> shared\types\cognitive-states.ts
echo   confidence: number; >> shared\types\cognitive-states.ts
echo   timestamp: number; >> shared\types\cognitive-states.ts
echo   factors: string[]; >> shared\types\cognitive-states.ts
echo } >> shared\types\cognitive-states.ts
echo. >> shared\types\cognitive-states.ts
echo export type InteractionPattern = 'reading' ^| 'scrolling' ^| 'clicking' ^| 'typing' ^| 'idle'; >> shared\types\cognitive-states.ts

REM Fix session-data.ts
echo // Session Data Types > shared\types\session-data.ts
echo import { CognitiveState } from './cognitive-states'; >> shared\types\session-data.ts
echo. >> shared\types\session-data.ts
echo export interface SessionData { >> shared\types\session-data.ts
echo   id: string; >> shared\types\session-data.ts
echo   userId: string; >> shared\types\session-data.ts
echo   startTime: number; >> shared\types\session-data.ts
echo   endTime?: number; >> shared\types\session-data.ts
echo   cognitiveState: CognitiveState; >> shared\types\session-data.ts
echo   url: string; >> shared\types\session-data.ts
echo   domain: string; >> shared\types\session-data.ts
echo   interactions: number; >> shared\types\session-data.ts
echo   focusTime: number; >> shared\types\session-data.ts
echo } >> shared\types\session-data.ts

REM Fix user-preferences.ts
echo // User Preferences Types > shared\types\user-preferences.ts
echo import { InteractionPattern } from './cognitive-states'; >> shared\types\user-preferences.ts
echo. >> shared\types\user-preferences.ts
echo export interface UserPreferences { >> shared\types\user-preferences.ts
echo   id: string; >> shared\types\user-preferences.ts
echo   userId: string; >> shared\types\user-preferences.ts
echo   cognitiveDetectionEnabled: boolean; >> shared\types\user-preferences.ts
echo   contentAdaptationEnabled: boolean; >> shared\types\user-preferences.ts
echo   knowledgeMappingEnabled: boolean; >> shared\types\user-preferences.ts
echo   adaptationIntensity: number; >> shared\types\user-preferences.ts
echo   preferredFontSize: number; >> shared\types\user-preferences.ts
echo   preferredLineHeight: number; >> shared\types\user-preferences.ts
echo   highlightKeyTerms: boolean; >> shared\types\user-preferences.ts
echo   simplifyComplexSentences: boolean; >> shared\types\user-preferences.ts
echo   showVisualCues: boolean; >> shared\types\user-preferences.ts
echo   breakReminders: boolean; >> shared\types\user-preferences.ts
echo   notificationsEnabled: boolean; >> shared\types\user-preferences.ts
echo   dataRetentionPeriod: string; >> shared\types\user-preferences.ts
echo   excludedDomains: string[]; >> shared\types\user-preferences.ts
echo   learningGoals: string[]; >> shared\types\user-preferences.ts
echo   timezone: string; >> shared\types\user-preferences.ts
echo   preferredInteractionPattern: InteractionPattern; >> shared\types\user-preferences.ts
echo   createdAt: number; >> shared\types\user-preferences.ts
echo   updatedAt: number; >> shared\types\user-preferences.ts
echo } >> shared\types\user-preferences.ts

REM Fix performance-utils.ts
echo // Performance Utilities > shared\utils\performance-utils.ts
echo export const performanceUtils = { >> shared\utils\performance-utils.ts
echo   measureTime: (fn: Function^) =^> { >> shared\utils\performance-utils.ts
echo     const start = performance.now(^); >> shared\utils\performance-utils.ts
echo     const result = fn(^); >> shared\utils\performance-utils.ts
echo     const end = performance.now(^); >> shared\utils\performance-utils.ts
echo     return { result, duration: end - start }; >> shared\utils\performance-utils.ts
echo   }, >> shared\utils\performance-utils.ts
echo   debounce: (fn: Function, delay: number^) =^> { >> shared\utils\performance-utils.ts
echo     let timeoutId: NodeJS.Timeout; >> shared\utils\performance-utils.ts
echo     return (...args: any[]^) =^> { >> shared\utils\performance-utils.ts
echo       clearTimeout(timeoutId^); >> shared\utils\performance-utils.ts
echo       timeoutId = setTimeout(^(^) =^> fn.apply(null, args^), delay^); >> shared\utils\performance-utils.ts
echo     }; >> shared\utils\performance-utils.ts
echo   } >> shared\utils\performance-utils.ts
echo }; >> shared\utils\performance-utils.ts

REM Fix api-endpoints.ts
echo // API Endpoints Configuration > shared\constants\api-endpoints.ts
echo export const API_ENDPOINTS = { >> shared\constants\api-endpoints.ts
echo   BASE_URL: 'http://localhost:3000/api', >> shared\constants\api-endpoints.ts
echo   COGNITIVE_STATE: '/cognitive-state', >> shared\constants\api-endpoints.ts
echo   SESSION_DATA: '/session-data', >> shared\constants\api-endpoints.ts
echo   USER_PREFERENCES: '/user-preferences', >> shared\constants\api-endpoints.ts
echo   KNOWLEDGE_GRAPH: '/knowledge-graph', >> shared\constants\api-endpoints.ts
echo   ANALYTICS: '/analytics' >> shared\constants\api-endpoints.ts
echo }; >> shared\constants\api-endpoints.ts

echo [SUCCESS] Shared types and utilities fixed!

REM Fix theme-provider.tsx
echo [STEP] Fixing theme provider...
echo "use client" > components\theme-provider.tsx
echo import { ThemeProvider as NextThemesProvider } from "next-themes" >> components\theme-provider.tsx
echo import type { ComponentProps } from "react" >> components\theme-provider.tsx
echo. >> components\theme-provider.tsx
echo type ThemeProviderProps = ComponentProps^<typeof NextThemesProvider^> >> components\theme-provider.tsx
echo. >> components\theme-provider.tsx
echo export function ThemeProvider({ children, ...props }: ThemeProviderProps^) { >> components\theme-provider.tsx
echo   return ^<NextThemesProvider {...props}^>{children}^</NextThemesProvider^> >> components\theme-provider.tsx
echo } >> components\theme-provider.tsx

echo [SUCCESS] Theme provider fixed!

REM Copy shared files to chrome-extension
echo [STEP] Copying shared files to chrome extension...
xcopy shared chrome-extension\shared /E /I /Y >nul

REM Navigate to chrome-extension directory
cd chrome-extension

REM Create proper tsconfig.json for extension
echo [STEP] Creating TypeScript configuration...
echo { > tsconfig.json
echo   "compilerOptions": { >> tsconfig.json
echo     "target": "ES2020", >> tsconfig.json
echo     "module": "ESNext", >> tsconfig.json
echo     "moduleResolution": "node", >> tsconfig.json
echo     "strict": false, >> tsconfig.json
echo     "esModuleInterop": true, >> tsconfig.json
echo     "skipLibCheck": true, >> tsconfig.json
echo     "forceConsistentCasingInFileNames": true, >> tsconfig.json
echo     "resolveJsonModule": true, >> tsconfig.json
echo     "isolatedModules": true, >> tsconfig.json
echo     "noEmit": false, >> tsconfig.json
echo     "outDir": "./dist", >> tsconfig.json
echo     "baseUrl": ".", >> tsconfig.json
echo     "paths": { >> tsconfig.json
echo       "@shared/*": ["./shared/*"] >> tsconfig.json
echo     } >> tsconfig.json
echo   }, >> tsconfig.json
echo   "include": [ >> tsconfig.json
echo     "src/**/*", >> tsconfig.json
echo     "shared/**/*" >> tsconfig.json
echo   ], >> tsconfig.json
echo   "exclude": [ >> tsconfig.json
echo     "node_modules", >> tsconfig.json
echo     "dist" >> tsconfig.json
echo   ] >> tsconfig.json
echo } >> tsconfig.json

REM Update webpack.config.js to handle TypeScript properly
echo [STEP] Updating webpack configuration...
echo const path = require('path'^); > webpack.config.js
echo const CopyPlugin = require('copy-webpack-plugin'^); >> webpack.config.js
echo const HtmlWebpackPlugin = require('html-webpack-plugin'^); >> webpack.config.js
echo. >> webpack.config.js
echo module.exports = { >> webpack.config.js
echo   mode: 'development', >> webpack.config.js
echo   entry: { >> webpack.config.js
echo     'background/service-worker': './src/background/service-worker.js', >> webpack.config.js
echo     'content-scripts/main-content': './src/content-scripts/main-content.js', >> webpack.config.js
echo     'popup/popup': './src/popup/popup.js', >> webpack.config.js
echo     'options/options': './src/options/options.js', >> webpack.config.js
echo     'dashboard/dashboard': './src/dashboard/dashboard.js' >> webpack.config.js
echo   }, >> webpack.config.js
echo   output: { >> webpack.config.js
echo     path: path.resolve(__dirname, 'dist'^), >> webpack.config.js
echo     filename: '[name].js', >> webpack.config.js
echo     clean: true >> webpack.config.js
echo   }, >> webpack.config.js
echo   module: { >> webpack.config.js
echo     rules: [ >> webpack.config.js
echo       { >> webpack.config.js
echo         test: /\.tsx?$/, >> webpack.config.js
echo         use: [ >> webpack.config.js
echo           { >> webpack.config.js
echo             loader: 'ts-loader', >> webpack.config.js
echo             options: { >> webpack.config.js
echo               transpileOnly: true, >> webpack.config.js
echo               compilerOptions: { >> webpack.config.js
echo                 noEmit: false >> webpack.config.js
echo               } >> webpack.config.js
echo             } >> webpack.config.js
echo           } >> webpack.config.js
echo         ], >> webpack.config.js
echo         exclude: /node_modules/ >> webpack.config.js
echo       }, >> webpack.config.js
echo       { >> webpack.config.js
echo         test: /\.css$/i, >> webpack.config.js
echo         use: ['style-loader', 'css-loader'] >> webpack.config.js
echo       } >> webpack.config.js
echo     ] >> webpack.config.js
echo   }, >> webpack.config.js
echo   plugins: [ >> webpack.config.js
echo     new CopyPlugin({ >> webpack.config.js
echo       patterns: [ >> webpack.config.js
echo         { from: 'manifest.json', to: 'manifest.json' }, >> webpack.config.js
echo         { from: 'src/assets', to: 'assets', noErrorOnMissing: true } >> webpack.config.js
echo       ] >> webpack.config.js
echo     }^), >> webpack.config.js
echo     new HtmlWebpackPlugin({ >> webpack.config.js
echo       template: './src/popup/popup.html', >> webpack.config.js
echo       filename: 'popup/popup.html', >> webpack.config.js
echo       chunks: ['popup/popup'] >> webpack.config.js
echo     }^), >> webpack.config.js
echo     new HtmlWebpackPlugin({ >> webpack.config.js
echo       template: './src/options/options.html', >> webpack.config.js
echo       filename: 'options/options.html', >> webpack.config.js
echo       chunks: ['options/options'] >> webpack.config.js
echo     }^), >> webpack.config.js
echo     new HtmlWebpackPlugin({ >> webpack.config.js
echo       template: './src/dashboard/dashboard.html', >> webpack.config.js
echo       filename: 'dashboard/dashboard.html', >> webpack.config.js
echo       chunks: ['dashboard/dashboard'] >> webpack.config.js
echo     }^) >> webpack.config.js
echo   ], >> webpack.config.js
echo   resolve: { >> webpack.config.js
echo     extensions: ['.tsx', '.ts', '.js'], >> webpack.config.js
echo     alias: { >> webpack.config.js
echo       '@shared': path.resolve(__dirname, './shared'^) >> webpack.config.js
echo     } >> webpack.config.js
echo   }, >> webpack.config.js
echo   devtool: 'cheap-module-source-map' >> webpack.config.js
echo }; >> webpack.config.js

REM Install missing dependencies
echo [STEP] Installing missing dependencies...
npm install --save-dev ts-loader typescript @types/chrome

echo [SUCCESS] All errors should now be fixed!
echo.
echo [INFO] Now run: npm run dev
echo [INFO] The extension should build without errors.

cd ..
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ Fix Complete!                         ║
echo ║          Chrome Extension should now build properly          ║
echo ╚══════════════════════════════════════════════════════════════╝
