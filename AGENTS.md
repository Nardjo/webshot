# AGENTS.md

This file provides guidance to AI agents (Claude Code, OpenCode, etc.) when working with code in this repository.

## Project Overview

**Webshot** is a Raycast extension that captures screenshots of URLs in both desktop and mobile viewports simultaneously. It uses Puppeteer Core for headless browser automation and Sharp for PNG compression.

## Commands

```bash
npm run dev          # Start Raycast development mode
npm run build        # Build the extension
npm run lint         # Run ESLint
npm run fix-lint     # Fix linting issues automatically
```

## Architecture

The extension has a two-layer architecture:

1. **Raycast Layer** (`src/capture-screenshot.tsx`)
   - React/TypeScript component handling Raycast UI
   - Spawns the capture script via `execFileAsync`
   - Parses JSON results for success/failure toasts

2. **Capture Layer** (`scripts/capture.js`)
   - Pure Node.js script using Puppeteer Core
   - Launches local Chrome browser
   - Captures two viewports:
     - Desktop: 1456×816 @ 2x scale
     - Mobile: iPhone 14 Pro emulation (390×844 with full UA/touch)
   - Compresses output with Sharp (PNG level 9)

**Data flow:** Raycast command → execFileAsync → capture.js → Chrome → PNG files → JSON response → Toast notification

## Configuration

Environment variables (`.env`):
- `CHROME_PATH` - Path to Chrome (defaults to macOS standard location)
- `OUTPUT_DIR` - Screenshot output directory (defaults to `~/Downloads/screenshots`)

## Key Implementation Notes

- Screenshots use `waitUntil: 'networkidle0'` with 30s timeout
- Mobile emulation uses Puppeteer's `KnownDevices` for accurate iPhone 14 Pro simulation
- File naming: `{domain}-desktop.png` and `{domain}-mobile.png`
- The Raycast command runs in `no-view` mode (background execution only)
