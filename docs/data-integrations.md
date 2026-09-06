# TraceAI data integrations

TraceAI uses two complementary data paths:

| System | Role | Data required |
| --- | --- | --- |
| Entire / `entire.io` | Live code-understanding workflow | Repository identity, branch/commit, checkpoint ID, session transcript metadata, graph nodes/edges, search/review results |
| Databricks | Historical analytics and rollups | Commit/file events, risk scores, complexity metrics, dependency edges, language counts, and event timestamps |

## Entire evidence path

Entire remains the source of truth for interactive work. A session should carry its
`checkpointId`, `commitSha`, `repository`, `branch`, `filesExplored`, questions, and
findings. Impact analysis should retain the graph query inputs and outputs so a user
can verify the result against source and tests. Checkpoint IDs must be treated as
opaque identifiers; the UI should link back to Entire rather than copying transcripts
into analytics tables.

## Databricks analytics path

The analytics page expects a backend endpoint configured with
`VITE_DATABRICKS_ANALYTICS_URL`. The endpoint receives `?range=7d|30d|90d` and returns
the JSON shape represented by `AnalyticsData` in `src/lib/mock-data.ts` (or
`{ data: AnalyticsData }`). Keep Databricks credentials on that backend route; never
put a workspace token in browser environment variables.

The backend query should be parameterized by repository and time range and produce:

- risk trend points: date, average risk, high-risk file count, total file count;
- activity points: week, commits, changed files, added lines, removed lines;
- hotspots: file, complexity, changes, bugs, and risk;
- coupling: module pair, coupling score, and shared dependency count;
- language distribution and optional change heatmap.

When the endpoint is absent or fails validation, TraceAI shows deterministic demo data
and labels it `Databricks demo fallback`. This makes the failure visible instead of
presenting mock values as live warehouse results.
