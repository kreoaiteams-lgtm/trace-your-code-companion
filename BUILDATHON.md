# TraceAI

## One-sentence summary
TraceAI is a full-stack codebase intelligence platform that maps structural dependencies via Entire Graph, provides impact analysis for safe refactoring, and preserves context through Checkpoint-backed sessions.

## Problem, intended user and why it matters
**Intended User:** Software developers and engineering teams.
**Problem:** Developers often struggle to understand the "blast radius" of code changes in large codebases. Furthermore, when they investigate a complex issue, the context (which files they looked at, what risks they identified) is easily lost during handoff to teammates or AI agents.
**Why it matters:** TraceAI visualizes structural dependencies to prevent breaking changes and saves exploration paths ("traces") so context is never lost, saving hours of developer time.

## Selected Entire track and why Entire is essential
**Tracks:** Checkpoint-Native Developer Experience + Graph Intelligence (and Best Use of Databricks).
**Why Entire is Essential:**
- **Entire Graph** provides the deterministic, AST-level dependency mapping that drives our visual codebase explorer and risk reports. Regular grep/search cannot reliably map direct and transitive dependents.
- **Entire Checkpoints** are fundamental to TraceAI's "Session Manager". They allow developers to snapshot a complex debugging/exploration session and easily hand it off to another developer or agent.

## Architecture and main workflow
TraceAI is built using React, TanStack Router, and Tailwind CSS.
**Main Workflow:**
1. A developer visits the **Dashboard** to see overall codebase risk trends (powered by Databricks).
2. They use the **Impact Analyzer** (powered by Entire Graph) to see the blast radius of a specific function or component they want to change.
3. They save this exploration path and findings as a "Trace Session" (powered by Entire Checkpoints) which can be instantly resumed by a teammate or AI agent.

## Entire Graph findings and verification
During development, we actively used Entire Graph to verify our codebase structure:
- **Impact Analysis:** We ran `entire graph impact "TraceApp"` and verified that it serves as the root component with 0 direct/transitive callers, but correctly identified its dependencies like `react.useState` and `cn` (from `src/lib/utils.ts`).
- **Semantic Diff:** We ran `entire graph diff --base HEAD~1 --head HEAD` which perfectly captured structural additions at an entity level (e.g., adding `AGENTS.md` and `CLAUDE.md` sections) rather than just raw string diffs, verifying the depth of the graph engine.

## Noon Curveball: what changed and how we adapted
**Track 1: Privacy Boundary**
We adapted our app to handle sensitive repositories where raw prompts/transcripts must not be sent externally. 
- **Impact Analysis**: We ran `entire graph impact TraceSession` and `SessionFinding` to map the blast radius before changing our data models.
- **UI Adaptation**: We added an `isRedacted` flag to our data models. The UI now renders prominent "Privacy Boundary Enforced" banners, Lock icon badges, and blurs out redacted descriptions to clearly distinguish incomplete context.
- **Local Privacy**: We added a "Local & Private" badge to the chat interface to reassure users that prompts stay local.
- **Tests**: We added a "Security Audit [REDACTED]" session to our mock data as a test case for graceful degradation.

## Checkpoint links and what each checkpoint proves
- **Initial Checkpoint (cd72444):** Initial understanding and intended architecture setup. Proves we established the core UI structure (Dashboard, Session Manager, Graph Explorer, Impact Analyzer) and the data layer mapping before integrating real CLI data.
- **Pre-Curveball Checkpoint (90ffd26):** The last stable state before the Noon Curveball. Proves the UI was fully functional with simulated chat and mocked session management.
- **Curveball Response Checkpoint (be02485):** Response to the Noon Curveball. Proves we successfully implemented Track 1 (Privacy Boundary) with redacted session handling, UI warnings, and local execution guarantees.
- *(Pending)*: Final implementation and verification.

## Setup, run and test instructions
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Entire CLI setup:
   ```bash
   entire login
   entire repo mirror create
   entire repo clone /gh/YOUR-GITHUB-HANDLE/YOUR-REPOSITORY
   cd trace-your-code-companion
   entire enable -y --agent gemini
   entire plugin install graph
   entire graph init-agents --repo .
   ```

## Databricks use, data sources and limitations (if applicable)
**Track:** Best Use of Databricks.
Databricks powers the Analytics dashboard in TraceAI. It aggregates data on change frequency, code complexity hotspots, and risk scores over time. This materially improves the product by allowing teams to track architectural drift historically. 

## Known limitations and next steps
- **Known Limitations:** The Databricks visualization and Graph/Checkpoint integrations currently rely on a rich mock data layer (`src/lib/mock-data.ts`) to match the API shapes while we await live workspace credentials and complete the CLI integration.
- **Next Steps:** Swap the mock data layer for live calls to the Entire CLI (`entire graph impact`, `entire checkpoint search`) and Databricks SQL endpoint, pushing this into production readiness.
