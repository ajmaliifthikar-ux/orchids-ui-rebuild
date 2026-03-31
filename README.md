# Orchids UI Rebuild

Modern React + TypeScript + Electron desktop application with design-to-code pipeline.

## Project Overview

This project is being built using:
- **Stitch** (UI/UX design generation)
- **Jules** (AI-powered code generation)
- **React 19** (Frontend framework)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Dark theme styling)
- **Zustand** (State management)
- **Electron** (Desktop application)

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Architecture

### Components

The application consists of three main screens:

1. **HomeScreen** - Main dashboard with project overview
2. **SettingsScreen** - Configuration and system settings
3. **DashboardScreen** - Metrics and workflow management

### State Management

Uses Zustand with persist middleware for global state management.

### Styling

Dark theme with custom color palette:
- Background: #0a0a0a
- Surface: #1a1a1a
- Border: #252525
- Text: #ffffff
- Accent colors: Blue (#3b82f6), Gold (#f59e0b), Green (#10b981), Red (#ef4444)

## Integration

### Stitch + Jules Pipeline

1. **Design Phase**: Create UI designs with Stitch
2. **Specification Phase**: Document component specs and requirements
3. **Code Generation**: Jules generates production-ready React components
4. **Integration**: Connect components to state management and IPC bridges

### Electron IPC Bridge

The application communicates with Electron main process via IPC for:
- File operations
- System information
- Native OS interactions

## Component Specifications

All components follow strict TypeScript interfaces and prop definitions.
See COMPONENT_SPECIFICATIONS.md for full documentation.

## Status

🚀 Repository initialized and connected to Jules for code generation
