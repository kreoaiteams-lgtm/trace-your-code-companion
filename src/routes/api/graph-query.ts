import { createAPIFileRoute } from "@tanstack/react-start/api";

const allowedCommands = new Set(["search", "def", "neighbors"]);

export const APIRoute = createAPIFileRoute("/api/graph-query")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const command = url.searchParams.get("command") ?? "search";
    const query = url.searchParams.get("query")?.trim();

    if (!allowedCommands.has(command) || !query) {
      return Response.json(
        { error: "Use a supported command and a non-empty query." },
        { status: 400 },
      );
    }

    try {
      const { execFileSync } = await import("node:child_process");
      const args = ["graph", command, "--repo", process.cwd(), "--format", "json"];
      if (command === "search") args.push("--query", query);
      else args.push("--symbol", query);

      const output = execFileSync("entire", args, {
        encoding: "utf-8",
        timeout: 15_000,
        maxBuffer: 2 * 1024 * 1024,
      });
      return Response.json(JSON.parse(output));
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Entire Graph query failed." },
        { status: 500 },
      );
    }
  },
});
