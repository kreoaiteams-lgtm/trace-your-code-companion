# TraceAI — Think Better with Your Code

TraceAI is a Checkpoint-Native codebase intelligence platform that maps structural dependencies via Entire Graph, provides impact analysis for safe refactoring, and preserves context through Checkpoint-backed sessions.

## 🚀 The Hackathon Project
This repository contains the UI and Frontend codebase for the **Buildathon 2026** submission. We built this under the **Checkpoint-Native Developer Experience** and **Graph Intelligence** tracks.

### Key Features
- **Graph Explorer**: Visualize your codebase's dependency graph powered by Entire Graph.
- **Impact Analyzer**: See the exact blast radius of a file or function change before you make it.
- **Session Manager**: Save your exploration paths as Checkpoints so you never lose context when handing off to a teammate or AI agent.
- **Databricks Analytics**: Track codebase complexity and risk trends historically.

## 🛠️ Tech Stack
- React + Vite + TypeScript
- TanStack Router for type-safe routing
- Tailwind CSS with a soft, vibrant Anthropic typography design system
- Lucide React for iconography

## 🏁 Getting Started
```sh
npm install
npm run dev
```

### Entire CLI Setup
To utilize the graph intelligence and checkpoints, make sure you have the Entire CLI configured:
```bash
entire login
entire enable -y --agent gemini
entire plugin install graph
entire graph init-agents --repo .
```
