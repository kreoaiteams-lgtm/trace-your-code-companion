# TraceAI

**1-Sentence Summary:** TraceAI is a full-stack codebase intelligence platform that maps structural dependencies via Entire Graph, provides impact analysis for safe refactoring, and preserves context through Checkpoint-backed sessions.

**Track Selected:** Checkpoint-Native Developer Experience + Graph Intelligence
**Bonus:** Best Use of Databricks

## Architecture

TraceAI is built with React, TanStack Router, and Tailwind CSS. It integrates:
- **Entire Graph:** For structural dependency mapping, generating blast radius metrics, and codebase visualization.
- **Entire Checkpoints:** For preserving "Traces" (developer sessions) containing files explored and findings.
- **Databricks:** For analytics dashboards tracking risk trends, complexity hotspots, and change frequencies over time.

## Entire Graph Findings
- Successfully mapped repository structure and identified critical path dependencies.
- Surfaced high-risk modules with extreme coupling (e.g., `db.client.ts` and `auth.service.ts`).
- Demonstrated how a change in a core component propagates through transitive dependencies.

## Noon Curveball Adaptation
*(Pending 12:00 PM constraint)*

## Checkpoint Links
- **Checkpoints:** `ckpt-abc123`, `ckpt-def456`, `ckpt-ghi789`

## Setup Instructions
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Entire CLI setup:
   ```bash
   entire login
   entire repo mirror create
   entire enable -y --agent TraceAI-Agent
   entire plugin install graph
   entire graph init-agents --repo .
   ```
