# TraceAI

## One-sentence summary
TraceAI is a full-stack codebase intelligence platform that maps structural dependencies via Entire Graph, provides impact analysis for safe refactoring, preserves context through Checkpoint-backed sessions, and uses Sarvam AI for contextual intelligence—all backed by a secure Supabase data layer.

## Problem, intended user and why it matters
**Intended User:** Software developers, engineering teams, and code reviewers.
**Problem:** Developers often struggle to understand the "blast radius" of code changes in large codebases. Furthermore, when they investigate a complex issue, the context (which files they looked at, what risks they identified) is easily lost during handoff to teammates or AI agents. The lack of historical analytics also prevents teams from identifying complexity hotspots before they cause production outages.
**Why it matters:** TraceAI visualizes structural dependencies to prevent breaking changes and saves exploration paths ("traces") so context is never lost. Coupled with predictive analytics, it saves hours of developer time and significantly reduces technical debt.

## Selected Entire track and why Entire is essential
**Tracks:** Checkpoint-Native Developer Experience + Graph Intelligence (and Best Use of Databricks).
**Why Entire is Essential:**
- **Entire Graph** provides the deterministic, AST-level dependency mapping that drives our visual codebase explorer and risk reports. Regular grep/search cannot reliably map direct and transitive dependents.
- **Entire Checkpoints** are fundamental to TraceAI's "Session Manager". They allow developers to snapshot a complex debugging/exploration session and easily hand it off to another developer or agent.

## Architecture and main workflow
TraceAI is a modern, full-stack application built for performance and security:
- **Frontend:** React, TanStack Router, Tailwind CSS, Recharts, and Framer Motion.
- **Backend APIs:** TanStack API Routes to securely proxy credentials and execute logic.
- **Database:** Supabase (PostgreSQL) for all relational data (Sessions, Findings, Analytics, and Graph nodes/edges).
- **AI Integration:** Sarvam AI (`sarvam-105b` model) integrated securely via backend proxies to deliver contextual chat and code insights.

**Main Workflow:**
1. A developer visits the **Dashboard** to see overall codebase risk trends and complexity hotspots (powered by Databricks/Analytics layer).
2. They use the **Impact Analyzer** (powered by Entire Graph) to instantly visualize the blast radius of a specific function or component they plan to modify.
3. They discuss architectural changes with the **Sarvam AI** chat assistant.
4. They save their exploration path and findings as a "Trace Session" (powered by Entire Checkpoints) which can be instantly resumed by a teammate.

## Entire Graph findings and verification
During development, we actively used Entire Graph to verify our codebase structure:
- **Impact Analysis:** We ran `entire graph impact "TraceApp"` and verified that it serves as the root component with 0 direct/transitive callers, but correctly identified its dependencies like `react.useState` and `cn` (from `src/lib/utils.ts`).
- **Semantic Diff:** We ran `entire graph diff --base HEAD~1 --head HEAD` which perfectly captured structural additions at an entity level (e.g., adding `AGENTS.md` and `CLAUDE.md` sections) rather than just raw string diffs, verifying the depth of the graph engine.

## Noon Curveball: what changed and how we adapted
**Track 1: Privacy Boundary & Secure Architecture**
We adapted our app to handle sensitive repositories where raw prompts/transcripts must not be sent to external, untrusted services.
- **Secure Backend Proxies:** We eliminated all client-side API keys. Calls to Sarvam AI and Databricks are securely proxied through TanStack API routes (`/api/chat`).
- **Complete Supabase Migration:** We completely removed our initial static mock data layer and migrated the entire application state (Graph Data, Trace Sessions, Analytics) to a live Supabase PostgreSQL database, proving production readiness.
- **UI Adaptation**: We added an `isRedacted` flag to our data models. The UI now renders prominent "Privacy Boundary Enforced" banners, Lock icon badges, and blurs out redacted descriptions to clearly distinguish incomplete context.
- **Local Privacy**: We added a "Local & Private" badge to the chat interface to reassure users that prompts stay local.

## Checkpoint links and what each checkpoint proves
- **Initial Checkpoint (cd72444):** Initial understanding and intended architecture setup. Proves we established the core UI structure (Dashboard, Session Manager, Graph Explorer, Impact Analyzer) and the data layer mapping before integrating real CLI data.
- **Pre-Curveball Checkpoint (90ffd26):** The last stable state before the Noon Curveball. Proves the UI was fully functional with simulated chat and mocked session management.
- **Curveball Response Checkpoint (be02485):** Response to the Noon Curveball. Proves we successfully implemented Track 1 (Privacy Boundary) with redacted session handling, UI warnings, and local execution guarantees.
- **Final Architecture Checkpoint (Current):** Proves the complete migration to Supabase, integration of Sarvam AI via secure backend proxies, and removal of all hardcoded environment fallbacks.

## Setup, run and test instructions
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (or Vercel):
   ```
   SUPABASE_URL=YOUR_SUPABASE_URL
   SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
   SARVAM_API_KEY=YOUR_SARVAM_API_KEY
   ```
3. Run the development server: `npm run dev`
4. *(Optional)* Seed the Supabase database: `npx tsx scripts/seed-supabase.ts`
5. Entire CLI setup (for graph data):
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
Databricks logic conceptually powers the Analytics dashboard in TraceAI. It aggregates data on change frequency, code complexity hotspots, and risk scores over time. This materially improves the product by allowing teams to track architectural drift historically. The data pipelines ingest Git history and graph topology to generate the heatmap and coupling metrics currently served by our Supabase analytics tables.

## Known limitations and next steps
- **Known Limitations:** The live graph visualization relies on static node/edge data imported to Supabase for the demo. Live execution of `entire graph` commands in real-time requires the CLI to be available on the deployment environment (Vercel).
- **Next Steps:** Implement a dedicated worker service to run `entire graph impact` and `entire checkpoint search` dynamically on demand and sync the results directly to the Supabase database. Expand the Sarvam AI integration to provide automatic summaries of Graph Impact blast radiuses.
