# TraceAI

## One-sentence summary
TraceAI helps developers understand unfamiliar GitHub repositories, brainstorm solutions with AI, and inspect code dependencies before making changes.

## Problem, intended user and why it matters
Developers lose time reconstructing architecture, tracing dependencies, and preserving the reasoning behind a proposed change. TraceAI is designed for developers, reviewers, and small engineering teams who need a fast way to explore a repository and turn questions into actionable implementation ideas. Better context reduces risky edits, duplicated investigation, and slow handoffs.

## Selected Entire track and why Entire is essential
TraceAI targets the Checkpoint-Native Developer Experience and Graph Intelligence tracks. Entire is essential because its Graph workflow provides structural code relationships that text search cannot reliably infer, while checkpoints provide durable context for agent-assisted exploration and handoff. TraceAI can use those results as evidence alongside AI suggestions instead of treating generated answers as the source of truth.

## Architecture and main workflow
The app is a React and TypeScript frontend using TanStack Router, Tailwind CSS, Lucide icons, Recharts, and a small server-side API layer.

The main workflow is:

1. The user signs in with GitHub or the manual demo login.
2. Trace welcomes the user and opens the repository connection screen.
3. The user connects or selects a GitHub repository.
4. The user chooses a repository and one of its conversations from the workspace sidebar.
5. Trace answers repository questions, suggests solutions, and exposes graph, impact, session, and analytics views.
6. The user can preserve useful investigation context as a session for later review.

## Entire Graph findings and verification
The repository includes an Entire Graph integration path for impact analysis. The impact API passes a repository working directory and symbol to the Entire CLI, then renders the returned graph relationships in the impact view. This keeps structural findings tied to a concrete graph query rather than presenting an unverified AI guess.

Verification should be performed from a repository with Entire Graph initialized:

```bash
entire graph init-agents --repo .
entire graph impact --repo . --symbol <symbol> --format json
```

The UI currently includes deterministic fallback data when live graph execution is unavailable in the deployment environment.

## Noon Curveball: what changed and how we adapted
The product direction evolved from a broad pitch surface into a focused repository exploration workspace. We removed the in-app presentation deck from the main navigation, made the repository the top-level workspace, and added multiple conversations under each repository. The login flow was simplified into GitHub and manual sign-in, followed by a short welcome screen and repository connection.

We also kept integration boundaries explicit: AI requests are sent through a server route, repository context is attached to the conversation, and unavailable external services fall back visibly instead of silently presenting fabricated live results.

## Checkpoint links and what each checkpoint proves
The current Git history provides the following implementation milestones:

- [`dff2225`](https://github.com/kreoaiteams-lgtm/trace-your-code-companion/commit/dff2225): early project and UI exploration.
- [`d77fc00`](https://github.com/kreoaiteams-lgtm/trace-your-code-companion/commit/d77fc00): completed the core TraceAI graph workflow and app shell.
- [`57a633e`](https://github.com/kreoaiteams-lgtm/trace-your-code-companion/commit/57a633e): refined the chat experience and interaction flow.
- [`7b6e7a7`](https://github.com/kreoaiteams-lgtm/trace-your-code-companion/commit/7b6e7a7): current repository state with the latest workspace and chat updates.

These are Git commits, not retroactive Entire checkpoints. `entire checkpoint list` currently reports zero checkpoints on this branch because the earlier work was committed outside an Entire-tracked agent session.

## Setup, run and test instructions
Install dependencies and start the app:

```bash
npm install
npm run dev
```

Build the production bundle:

```bash
npm run build
```

For Entire Graph workflows, authenticate and enable the repository first:

```bash
entire login
entire enable
entire agent add gemini
entire graph init-agents --repo .
```

The app currently uses simulated authentication and demo repository data in the frontend. Production GitHub OAuth and persistent user authentication still require backend credentials and a configured identity provider.

## Databricks use, data sources and limitations (if applicable)
Databricks is an optional analytics integration, not the primary repository or authentication system. A backend Databricks endpoint can provide historical risk trends, activity, complexity hotspots, coupling, language distribution, and change heatmaps.

Potential data sources include Git history, Entire Graph nodes and edges, impact reports, pipeline events, and repository change metrics. Databricks credentials must remain on the server; they must never be exposed in browser environment variables. When the endpoint is unavailable, the UI uses clearly labeled deterministic demo data.

## Known limitations and next steps
- GitHub OAuth and manual authentication are currently demo flows backed by local browser state.
- Live graph execution depends on the Entire CLI and graph data being available in the runtime environment.
- Existing historical work cannot be retroactively converted into Entire checkpoints.
- Conversation persistence is currently local UI state and should move to a durable backend.
- The next priorities are real GitHub repository indexing, persistent conversations, verified checkpoint links, live impact queries, and a production Databricks analytics worker.
