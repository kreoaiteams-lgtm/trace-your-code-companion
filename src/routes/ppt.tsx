import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Network, Zap, Shield, BarChart3, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ppt")({
  head: () => ({
    meta: [
      { title: "Presentation — TraceAI" },
      { name: "description", content: "TraceAI Pitch Deck & Architecture Overview" },
    ],
  }),
  component: PresentationPage,
});

const slides = [
  {
    id: "intro",
    title: "TraceAI: Codebase Intelligence",
    subtitle: "Stop guessing. Start tracing.",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Modern codebases are too complex for traditional search. TraceAI gives you a 
          deterministic, graph-based understanding of your entire repository, combined with 
          intelligent AI assistance.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-border shadow-sm w-48">
            <Network className="size-8 text-emerald-500 mb-3" />
            <span className="font-semibold text-gray-900">Entire Graph</span>
            <span className="text-xs text-muted-foreground mt-1">Deterministic AST Mapping</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-border shadow-sm w-48">
            <Zap className="size-8 text-amber-500 mb-3" />
            <span className="font-semibold text-gray-900">Sarvam AI</span>
            <span className="text-xs text-muted-foreground mt-1">Intelligent Chat Analysis</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-border shadow-sm w-48">
            <Database className="size-8 text-blue-500 mb-3" />
            <span className="font-semibold text-gray-900">Databricks</span>
            <span className="text-xs text-muted-foreground mt-1">Live Analytics & Telemetry</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "problem",
    title: "The Problem",
    subtitle: "Why grep and simple RAG fail",
    content: (
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm">✕</span>
            Traditional Text Search
          </h3>
          <ul className="space-y-4 text-red-800/80">
            <li>• Misses complex transitive dependencies</li>
            <li>• Hallucinates on similar variable names</li>
            <li>• Doesn't understand type boundaries</li>
            <li>• Cannot accurately predict blast radius</li>
          </ul>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm">✓</span>
            TraceAI + Entire Graph
          </h3>
          <ul className="space-y-4 text-emerald-800/80">
            <li>• Understands exact caller/callee trees</li>
            <li>• AST-level deterministic accuracy</li>
            <li>• Maps real data flows and type consumers</li>
            <li>• Calculates precise impact before you commit</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "impact",
    title: "Impact Analyzer",
    subtitle: "Know exactly what breaks before it breaks",
    content: (
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="border-b border-border p-4 bg-muted/30 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-red-400" />
            <div className="size-3 rounded-full bg-amber-400" />
            <div className="size-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">entire graph impact --symbol useAuth</span>
        </div>
        <div className="p-8">
          <div className="flex items-start gap-6">
            <div className="size-16 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Shield className="size-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Live Blast Radius Mapping</h3>
              <p className="text-muted-foreground mb-4">
                Powered by the <code className="text-emerald-600 bg-emerald-50 px-1 rounded">entire graph</code> CLI, 
                TraceAI analyzes your local workspace instantly. No code leaves your machine.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gray-50 border border-border">
                  <div className="text-2xl font-bold text-amber-500">23</div>
                  <div className="text-xs text-muted-foreground uppercase mt-1">Direct Callers</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-border">
                  <div className="text-2xl font-bold text-indigo-500">142</div>
                  <div className="text-xs text-muted-foreground uppercase mt-1">Transitive Reach</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-border">
                  <div className="text-2xl font-bold text-purple-500">8</div>
                  <div className="text-xs text-muted-foreground uppercase mt-1">Co-changed Files</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ai",
    title: "Sarvam AI Integration",
    subtitle: "105B parameters of context-aware intelligence",
    content: (
      <div className="space-y-8 w-full max-w-4xl text-center">
        <p className="text-lg text-muted-foreground">
          TraceAI doesn't just show you data; it helps you interpret it. We integrated the 
          <span className="font-bold text-gray-900 mx-1">sarvam-105b</span> model via a secure backend route 
          to provide instant architectural guidance.
        </p>
        <div className="relative mx-auto w-full max-w-2xl bg-white rounded-2xl border border-border p-6 shadow-sm text-left">
          <div className="flex gap-4">
            <div className="size-8 rounded-full bg-gray-900 shrink-0" />
            <div>
              <div className="font-medium text-sm">TraceAI Assistant</div>
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl rounded-tl-none border border-border">
                Based on the graph data, changing <code className="text-emerald-600">useAuth()</code> will affect 
                <strong> 23 components</strong> across the application. I recommend creating a wrapper function first 
                to ensure backward compatibility during the migration.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
];

function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => setCurrentSlide((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setCurrentSlide((i) => Math.max(i - 1, 0));

  const slide = slides[currentSlide];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50/50">
      <div className="flex-1 flex flex-col items-center justify-center p-12 relative">
        
        {/* Slide Counter */}
        <div className="absolute top-8 right-8 text-sm font-medium text-muted-foreground bg-white px-3 py-1.5 rounded-full shadow-sm border border-border">
          {currentSlide + 1} / {slides.length}
        </div>

        {/* Slide Content */}
        <div className="w-full max-w-5xl flex flex-col items-center fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 text-center">
            {slide.title}
          </h1>
          <h2 className="text-xl text-emerald-600 font-medium mb-16 text-center">
            {slide.subtitle}
          </h2>
          
          <div className="flex justify-center w-full min-h-[300px]">
            {slide.content}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white p-2 rounded-2xl shadow-lg border border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            disabled={currentSlide === 0}
            className="rounded-xl"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex gap-2 px-4">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentSlide ? "w-8 bg-gray-900" : "w-2 bg-gray-200"
                )} 
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            disabled={currentSlide === slides.length - 1}
            className="rounded-xl"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

      </div>
    </div>
  );
}
