# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An educational adventure game for children. Two children adventure with Prince Boji and his crew in an ocean world featuring 4 oceans (East, West, South, North) and a mysterious ocean. Players battle monster bosses by answering knowledge-based questions - correct answers reduce monster HP, wrong answers reduce player HP. Difficulty increases progressively, with the Mysterious Ocean being the hardest.

## Architecture

### Tech Stack
- **Frontend**: React 18+ with Vite
- **Game Engine**: React-Three-Fiber (R3F) with OrthographicCamera for 2D view
- **State Management**: Zustand for game state
- **Styling**: CSS Modules or styled-components

### Project Structure
```
src/
├── components/          # React UI components
│   ├── game/            # Game-specific components
│   │   ├── Battle/      # Battle system UI
│   │   ├── Ocean/       # Ocean/level components
│   │   └── UI/          # HUD, menus, dialogs
│   └── common/          # Shared components
├── game/                # Core game logic (framework-agnostic)
│   ├── BattleEngine.ts  # Combat mechanics
│   ├── OceanWorld.ts    # World/map logic
│   ├── ExplorationStateMachine.ts  # Exploration state machine
│   └── types.ts         # Game type definitions
├── data/                # Data-driven configurations
│   ├── oceans/          # Ocean zone definitions
│   ├── monsters/        # Boss monster configurations
│   └── questions/       # Question banks by difficulty
├── store/               # Zustand state management
│   └── gameStore.ts     # Main game state store
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
└── assets/              # Images, audio, sprites, fonts
```

### Key Architectural Principles
- **Rendering abstraction**: Game rendering lives in dedicated components, decoupled from game logic
- **Data-driven design**: Oceans, monsters, and questions defined as configuration data
- **Progressive difficulty**: Question difficulty tied to ocean zone progression
- **Extensible to 3D**: 2D canvas renderer can be swapped with React-Three-Fiber renderer

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm test -- --watch  # Run tests in watch mode
```

## Code Conventions

- Use functional components with hooks
- All game state changes flow through Zustand actions
- UI components are separated from game logic
- Game mechanics and rules in `src/game/`
- Learning assessments are defined as data-driven configurations
- Exploration state machine defined in `src/game/ExplorationStateMachine.ts`
