import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/graph-impact")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const symbol = url.searchParams.get("symbol");

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Missing ?symbol= query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    try {
      // Use child_process to call the entire CLI
      const { execSync } = await import("node:child_process");
      const cwd = process.cwd();

      const raw = execSync(
        `entire graph impact --repo "${cwd}" --symbol "${symbol}" --format json --depth 2 --limit 20`,
        { encoding: "utf-8", timeout: 15_000, maxBuffer: 1024 * 1024 },
      );

      const data = JSON.parse(raw);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: unknown) {
      console.error("entire graph impact failed:", err);

      // Try to extract useful stderr / message
      const message =
        err instanceof Error ? err.message : "Unknown error running entire graph impact";

      return new Response(
        JSON.stringify({ error: message }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
