# TraceAI Application Data Documentation

This document outlines the data model and Supabase schema architecture used by TraceAI to handle graph dependencies, session traces, impact reports, and analytics.

## Core Schema Structure

TraceAI relies on a PostgreSQL database hosted on Supabase, designed to store and track codebase intelligence over time.

### 1. Codebase Graph (`graph_nodes`, `graph_edges`)

The core of TraceAI is a representation of the AST-level codebase dependencies.

- **`graph_nodes`**: Represents individual files or symbols in the codebase.
  - `id`: A unique identifier (typically the file path or symbol name).
  - `label`: The human-readable name of the file/symbol.
  - `type`: Either `file` or `symbol`.
  - `language`: The programming language (e.g., `typescript`, `python`).
  - `complexity`, `risk_score`: Metrics denoting the historical technical debt of the node.
  - `dependency_count`, `dependent_count`: Cached counts of edges.

- **`graph_edges`**: Represents dependencies between nodes (e.g., File A imports File B).
  - `source`: Foreign key to the dependent `graph_nodes.id`.
  - `target`: Foreign key to the dependency `graph_nodes.id`.
  - `type`: The type of dependency (e.g., `import`, `call`).

### 2. Trace Sessions & Findings (`trace_sessions`, `session_findings`)

Trace Sessions are user-driven or agent-driven debugging explorations. They encapsulate a "Trace" to prevent context loss during handoffs.

- **`trace_sessions`**: The top-level session.
  - `id`, `title`, `description`: Metadata for the trace session.
  - `status`: Lifecycle of the trace (`active`, `paused`, `completed`, `shared`).
  - `checkpoint_id`: The ID linking to the `entire checkpoint` in the CLI.
  - `files_explored`: A JSONB array of file paths explored during the trace.
  - `is_redacted`: A boolean flag used for the **Privacy Boundary**, indicating that sensitive context has been removed to comply with repository security guidelines.

- **`session_findings`**: Specific insights discovered during a trace session.
  - `session_id`: Foreign key linking the finding to its trace session.
  - `type`: E.g., `risk`, `insight`, `suggestion`.
  - `affected_files`: A JSONB array of files impacted by this finding.
  - `is_redacted`: Inherits the privacy boundary constraints of the session.

### 3. Impact Analysis (`impact_reports`)

When a developer queries the blast radius of a component, TraceAI generates an Impact Report.

- **`impact_reports`**: A cached snapshot of a component's blast radius.
  - `target_file`, `target_function`: The root component analyzed.
  - `risk_score`, `blast_radius`: Aggregate metrics for how dangerous a change is.
  - `direct_dependents`, `transitive_dependents`: Arrays of files that will be affected by a change.
  - `affected_tests`: Tests that must be run to verify the change.
  - `suggestions`: AI-generated suggestions (from Sarvam) on how to safely refactor the component.

### 4. Databricks Analytics (`analytics_*`)

For the "Best Use of Databricks" track, TraceAI projects historical analytics into several tables, allowing teams to track architectural drift over time.

- **`analytics_heatmap`**: Tracks change frequency across files by day.
- **`analytics_risk_trends`**: Tracks the average codebase risk score longitudinally.
- **`analytics_complexity_hotspots`**: Identifies specific files that have high complexity and high change frequency (bug magnets).
- **`analytics_module_coupling`**: Identifies tightly coupled modules that change together in the same commits.
- **`analytics_weekly_activity`**: High-level commit/velocity metrics by week.
- **`analytics_language_distribution`**: The split of languages across the repository.

## Deployment & Security

- **Environment Isolation:** Access to Supabase is strictly managed via server-side environment variables (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`) configured in Vercel. 
- **Privacy Boundary:** TraceAI enforces strict privacy boundaries for sensitive enterprise repositories. If a session is marked `is_redacted = true`, specific prompts, insights, and file details are obfuscated from the UI, and raw payloads are never forwarded to the Sarvam AI endpoints.
