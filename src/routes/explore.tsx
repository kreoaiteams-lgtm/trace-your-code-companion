import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Info,
  ChevronRight,
  X,
  GitBranch,
  FileCode,
  Box,
  Layers,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  mockGraphData,
  getNodeDependencies,
  getNodeDependents,
  getRiskColor,
  getRiskLabel,
  type GraphNode,
  type GraphEdge,
} from "@/lib/mock-data";

export const Route = createFileRoute("/explore")(
  {
    head: () => ({
      meta: [
        { title: "Graph Explorer — TraceAI" },
        { name: "description", content: "Visualize your codebase's dependency graph powered by Entire Graph." },
      ],
    }),
    component: GraphExplorer,
  },
);

// Simple force-directed layout
function computeLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number) {
  const positions = new Map<string, { x: number; y: number }>();
  const cx = width / 2;
  const cy = height / 2;

  // Initial circular layout
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    const radius = Math.min(width, height) * 0.35;
    positions.set(node.id, {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  });

  // Simple force iterations
  for (let iter = 0; iter < 50; iter++) {
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = positions.get(nodes[i].id)!;
        const b = positions.get(nodes[j].id)!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = 8000 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.x -= fx;
        a.y -= fy;
        b.x += fx;
        b.y += fy;
      }
    }

    // Attraction along edges
    for (const edge of edges) {
      const a = positions.get(edge.source);
      const b = positions.get(edge.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = (dist - 120) * 0.005 * edge.weight;
      const fx = (dx / Math.max(dist, 1)) * force;
      const fy = (dy / Math.max(dist, 1)) * force;
      a.x += fx;
      a.y += fy;
      b.x -= fx;
      b.y -= fy;
    }

    // Center gravity
    for (const node of nodes) {
      const pos = positions.get(node.id)!;
      pos.x += (cx - pos.x) * 0.01;
      pos.y += (cy - pos.y) * 0.01;
    }
  }

  return positions;
}

const nodeTypeIcons: Record<string, typeof FileCode> = {
  file: FileCode,
  module: Box,
  component: Layers,
  function: Zap,
  class: GitBranch,
};

function GraphExplorer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const width = 900;
  const height = 600;

  const filteredNodes = mockGraphData.nodes.filter((n) => {
    if (filterType !== "all" && n.type !== filterType) return false;
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredEdges = mockGraphData.edges.filter(
    (e) => filteredNodes.some((n) => n.id === e.source) && filteredNodes.some((n) => n.id === e.target),
  );

  const positions = computeLayout(filteredNodes, filteredEdges, width, height);

  const getConnectedIds = useCallback((nodeId: string) => {
    const connected = new Set<string>();
    mockGraphData.edges.forEach((e) => {
      if (e.source === nodeId) connected.add(e.target);
      if (e.target === nodeId) connected.add(e.source);
    });
    return connected;
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).tagName === "svg" || (e.target as SVGElement).tagName === "rect") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const activeNodeId = hoveredNode || selectedNode?.id;
  const connectedIds = activeNodeId ? getConnectedIds(activeNodeId) : new Set<string>();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
          {["all", "module", "component", "function"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filterType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(z + 0.2, 3))} aria-label="Zoom in">
            <ZoomIn className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(z - 0.2, 0.3))} aria-label="Zoom out">
            <ZoomOut className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} aria-label="Reset view">
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Graph Canvas */}
        <div className="relative flex-1 bg-[#fafbfc] overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" opacity="0.6" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
              </filter>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map((edge) => {
                const from = positions.get(edge.source);
                const to = positions.get(edge.target);
                if (!from || !to) return null;
                const isHighlighted = activeNodeId && (edge.source === activeNodeId || edge.target === activeNodeId);
                const isDimmed = activeNodeId && !isHighlighted;

                return (
                  <line
                    key={`${edge.source}-${edge.target}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? getRiskColor(
                      (mockGraphData.nodes.find((n) => n.id === edge.source)?.riskScore ?? 0 +
                      (mockGraphData.nodes.find((n) => n.id === edge.target)?.riskScore ?? 0)) / 2,
                    ) : "#cbd5e1"}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeDasharray={edge.type === "call" ? "6,3" : undefined}
                    opacity={isDimmed ? 0.1 : isHighlighted ? 1 : 0.4}
                    markerEnd="url(#arrowhead)"
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const pos = positions.get(node.id);
                if (!pos) return null;
                const isSelected = selectedNode?.id === node.id;
                const isHovered = hoveredNode === node.id;
                const isConnected = connectedIds.has(node.id);
                const isDimmed = activeNodeId && activeNodeId !== node.id && !isConnected;
                const nodeSize = 18 + node.dependentCount * 0.8;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={(e) => { e.stopPropagation(); setSelectedNode(isSelected ? null : node); }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                    style={{ opacity: isDimmed ? 0.15 : 1, transition: "opacity 0.3s" }}
                  >
                    {/* Glow ring for high risk */}
                    {node.riskScore >= 60 && (
                      <circle r={nodeSize + 6} fill="none" stroke={getRiskColor(node.riskScore)} strokeWidth="2" opacity="0.3">
                        <animate attributeName="r" values={`${nodeSize + 4};${nodeSize + 10};${nodeSize + 4}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Selection ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        r={nodeSize + 4}
                        fill="none"
                        stroke={getRiskColor(node.riskScore)}
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      r={nodeSize}
                      fill="white"
                      stroke={getRiskColor(node.riskScore)}
                      strokeWidth={isSelected ? 3 : 2}
                      filter="url(#shadow)"
                    />

                    {/* Inner color dot */}
                    <circle r={6} fill={getRiskColor(node.riskScore)} opacity="0.8" />

                    {/* Label */}
                    <text
                      y={nodeSize + 16}
                      textAnchor="middle"
                      className="text-[11px] font-medium fill-current"
                      style={{ fill: "#374151" }}
                    >
                      {node.label}
                    </text>

                    {/* Risk badge */}
                    <g transform={`translate(${nodeSize - 4}, ${-nodeSize + 4})`}>
                      <rect x="-8" y="-8" width="16" height="16" rx="8" fill={getRiskColor(node.riskScore)} />
                      <text textAnchor="middle" y="4" className="text-[8px] font-bold" style={{ fill: "white" }}>
                        {node.riskScore}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/95 p-3 backdrop-blur-sm text-xs space-y-1.5">
            <p className="font-semibold text-foreground mb-2">Risk Level</p>
            {[
              { label: "Critical (75+)", color: "#ef4444" },
              { label: "High (50-74)", color: "#f59e0b" },
              { label: "Moderate (25-49)", color: "#3b82f6" },
              { label: "Safe (0-24)", color: "#22c55e" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Stats overlay */}
          <div className="absolute top-4 left-4 rounded-lg border border-border bg-card/95 p-3 backdrop-blur-sm text-xs">
            <div className="flex items-center gap-4">
              <div><span className="font-semibold text-foreground">{filteredNodes.length}</span> <span className="text-muted-foreground">nodes</span></div>
              <div><span className="font-semibold text-foreground">{filteredEdges.length}</span> <span className="text-muted-foreground">edges</span></div>
              <div><span className="font-semibold text-foreground">{mockGraphData.metadata.avgComplexity.toFixed(1)}</span> <span className="text-muted-foreground">avg complexity</span></div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-border bg-card overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-medium">{selectedNode.label}</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
                  <X className="size-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Risk Score */}
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase text-muted-foreground">Risk Score</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: getRiskColor(selectedNode.riskScore) }}
                    >
                      {getRiskLabel(selectedNode.riskScore)}
                    </span>
                  </div>
                  <div className="text-3xl font-bold" style={{ color: getRiskColor(selectedNode.riskScore) }}>
                    {selectedNode.riskScore}
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedNode.riskScore}%`,
                        backgroundColor: getRiskColor(selectedNode.riskScore),
                      }}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Type", value: selectedNode.type },
                    { label: "Language", value: selectedNode.language },
                    { label: "Complexity", value: `${selectedNode.complexity}/10` },
                    { label: "Lines", value: selectedNode.linesOfCode.toLocaleString() },
                    { label: "Changes (30d)", value: selectedNode.changeFrequency },
                    { label: "Dependents", value: selectedNode.dependentCount },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md bg-muted/50 p-2.5">
                      <p className="text-[10px] uppercase text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Path */}
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Path</p>
                  <p className="text-xs font-mono text-foreground break-all">{selectedNode.path}</p>
                </div>

                {/* Dependencies */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <ChevronRight className="size-3" /> Dependencies ({getNodeDependencies(selectedNode.id).length})
                  </h4>
                  <div className="space-y-1">
                    {getNodeDependencies(selectedNode.id).map((dep) => (
                      <button
                        key={dep.id}
                        onClick={() => setSelectedNode(dep)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors text-left"
                      >
                        <span className="size-2 rounded-full" style={{ backgroundColor: getRiskColor(dep.riskScore) }} />
                        <span className="truncate">{dep.label}</span>
                        <span className="ml-auto text-muted-foreground">{dep.riskScore}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dependents */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <ChevronRight className="size-3" /> Dependents ({getNodeDependents(selectedNode.id).length})
                  </h4>
                  <div className="space-y-1">
                    {getNodeDependents(selectedNode.id).map((dep) => (
                      <button
                        key={dep.id}
                        onClick={() => setSelectedNode(dep)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors text-left"
                      >
                        <span className="size-2 rounded-full" style={{ backgroundColor: getRiskColor(dep.riskScore) }} />
                        <span className="truncate">{dep.label}</span>
                        <span className="ml-auto text-muted-foreground">{dep.riskScore}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
