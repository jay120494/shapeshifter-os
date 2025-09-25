# Shapeshifter OS - Personal Web Operating System

A personal, adaptive start screen for the web. Organize your digital life into three simple columns: Today, Patterns, and Snippets.

## Features

- **Today**: The 10 things that matter most right now
- **Patterns**: What you return to regularly - your habits and routines
- **Snippets**: Quick insights and actions without opening multiple tabs
- **Three adaptive profiles**: Senior, Default, and Power modes
- **Privacy-focused**: All data stays local by default

## Development

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Architecture

The application uses a three-column layout:

1. **Today Column**: Time-sensitive items and immediate priorities
2. **Patterns Column**: Recurring tasks and habitual workflows
3. **Snippets Column**: Quick reference materials and micro-actions

### Profile Modes

- **Senior Mode**: Larger text, higher contrast, reduced motion
- **Default Mode**: Balanced interface for most users
- **Power Mode**: Compact density with keyboard shortcuts

## Privacy

- Local-first data storage
- Opt-in cloud connectors
- One-click data wipe capability
- No tracking or analytics by default