import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const snapshot = execFileSync(
  "entire",
  ["graph", "snapshot", "--repo", ".", "--format", "ndjson", "--worktree"],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
);

const records = snapshot
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const files = records.filter((record) => record.record_type === "file");
const symbols = records.filter((record) => record.record_type === "symbol");
const relations = records.filter((record) => record.record_type === "relation");
const fileById = new Map(files.map((file) => [file.id, file.path]));
const symbolById = new Map(symbols.map((symbol) => [symbol.id, symbol.file_path]));
const resolveFile = (id) => fileById.get(id) ?? symbolById.get(id);
const sourceFiles = files.filter((file) => file.path.startsWith("src/"));
const nodeByPath = new Map(sourceFiles.map((file) => [file.path, file]));
const edges = new Map();

for (const relation of relations) {
  if (!["IMPORTS", "CALLS", "ASYNC_CALLS"].includes(relation.type)) continue;
  const source = resolveFile(relation.from_id);
  const target = resolveFile(relation.to_id);
  if (!source || !target || source === target || !nodeByPath.has(source) || !nodeByPath.has(target))
    continue;
  const key = `${source}->${target}`;
  edges.set(key, {
    source,
    target,
    type: relation.type === "IMPORTS" ? "import" : "call",
    weight: 0.8,
  });
}

const symbolCounts = new Map();
for (const symbol of symbols) {
  if (symbol.file_path?.startsWith("src/"))
    symbolCounts.set(symbol.file_path, (symbolCounts.get(symbol.file_path) ?? 0) + 1);
}
const dependentCounts = new Map();
for (const edge of edges.values())
  dependentCounts.set(edge.target, (dependentCounts.get(edge.target) ?? 0) + 1);
const nodes = sourceFiles.map((file, index) => {
  const complexity = Math.max(1, Math.min(10, Math.ceil((symbolCounts.get(file.path) ?? 1) / 4)));
  const dependentCount = dependentCounts.get(file.path) ?? 0;
  return {
    id: file.path,
    label: file.path.split("/").pop(),
    type: file.path.includes("routes/") ? "component" : "module",
    language: file.language === "TypeScript" ? "TypeScript" : file.language,
    path: file.path,
    complexity,
    changeFrequency: 0,
    linesOfCode: 0,
    riskScore: Math.min(95, complexity * 8 + dependentCount * 3),
    dependencyCount: [...edges.values()].filter((edge) => edge.source === file.path).length,
    dependentCount,
    x: (index % 8) * 110 + 80,
    y: Math.floor(index / 8) * 90 + 70,
  };
});

const output = `// Generated from Entire Graph. Run npm run graph:generate to refresh.\nimport type { GraphData } from "./mock-data";\n\nexport const entireGraphData: GraphData = ${JSON.stringify(
  {
    nodes,
    edges: [...edges.values()],
    metadata: {
      totalFiles: nodes.length,
      totalModules: nodes.length,
      avgComplexity: nodes.length
        ? Number((nodes.reduce((sum, node) => sum + node.complexity, 0) / nodes.length).toFixed(1))
        : 0,
      maxDepth: 0,
      lastAnalyzed: new Date().toISOString(),
    },
  },
  null,
  2,
)};\n`;

mkdirSync("src/lib", { recursive: true });
writeFileSync("src/lib/entire-graph-data.ts", output);
console.log(`Generated ${nodes.length} nodes and ${edges.size} edges from Entire Graph.`);
