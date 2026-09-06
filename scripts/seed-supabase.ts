import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Using the provided keys
const supabaseUrl = 'https://vdzhnlmeiicyypbolffr.supabase.co';
const supabaseKey = 'sb_secret_aq9f_OdqMQywDC6VVEGR7w_PxaU18Av'; // Using secret key for seeding to bypass RLS if any

const supabase = createClient(supabaseUrl, supabaseKey);

// We'll read the mock data using esbuild/ts-node, but let's just use the compiled JS or import directly if we run it via tsx
import { 
  mockGraphData, 
  mockSessions, 
  mockImpactReports, 
  mockAnalytics 
} from '../src/lib/mock-data';

async function seed() {
  console.log("Starting database seed...");

  // 1. Seed Graph Nodes
  console.log("Seeding graph_nodes...");
  const nodes = mockGraphData.nodes.map(n => ({
    id: n.id,
    label: n.label,
    type: n.type,
    language: n.language,
    path: n.path,
    complexity: n.complexity,
    change_frequency: n.changeFrequency,
    lines_of_code: n.linesOfCode,
    risk_score: n.riskScore,
    dependency_count: n.dependencyCount,
    dependent_count: n.dependentCount,
    x: n.x,
    y: n.y
  }));
  await supabase.from('graph_nodes').upsert(nodes);

  // 2. Seed Graph Edges
  console.log("Seeding graph_edges...");
  const edges = mockGraphData.edges.map(e => ({
    source: e.source,
    target: e.target,
    type: e.type,
    weight: e.weight
  }));
  await supabase.from('graph_edges').insert(edges);

  // 3. Seed Trace Sessions & Findings
  console.log("Seeding trace_sessions...");
  for (const session of mockSessions) {
    await supabase.from('trace_sessions').upsert({
      id: session.id,
      title: session.title,
      description: session.description,
      created_at: session.createdAt,
      updated_at: session.updatedAt,
      author: session.author,
      author_avatar: session.authorAvatar,
      status: session.status,
      files_explored: session.filesExplored,
      questions_asked: session.questionsAsked,
      checkpoint_id: session.checkpointId,
      tags: session.tags,
      is_redacted: session.isRedacted || false
    });

    const findings = session.findings.map(f => ({
      session_id: session.id,
      type: f.type,
      title: f.title,
      description: f.description,
      affected_files: f.affectedFiles,
      severity: f.severity,
      is_redacted: f.isRedacted || false
    }));
    await supabase.from('session_findings').insert(findings);
  }

  // 4. Seed Impact Reports
  console.log("Seeding impact_reports...");
  const reports = mockImpactReports.map(r => ({
    target_file: r.targetFile,
    target_function: r.targetFunction,
    risk_score: r.riskScore,
    blast_radius: r.blastRadius,
    direct_dependents: r.directDependents,
    transitive_dependents: r.transitiveDependents,
    affected_tests: r.affectedTests,
    suggestions: r.suggestions,
    severity: r.severity,
    created_at: r.createdAt
  }));
  await supabase.from('impact_reports').insert(reports);

  // 5. Analytics
  console.log("Seeding analytics...");
  await supabase.from('analytics_heatmap').insert(mockAnalytics.changeHeatmap);
  
  const riskTrends = mockAnalytics.riskTrends.map(r => ({
    date: r.date,
    avg_risk: r.avgRisk,
    high_risk_files: r.highRiskFiles,
    total_files: r.totalFiles
  }));
  await supabase.from('analytics_risk_trends').insert(riskTrends);

  await supabase.from('analytics_complexity_hotspots').insert(mockAnalytics.complexityHotspots);
  
  const coupling = mockAnalytics.moduleCoupling.map(m => ({
    module_a: m.moduleA,
    module_b: m.moduleB,
    coupling_score: m.couplingScore,
    shared_deps: m.sharedDeps
  }));
  await supabase.from('analytics_module_coupling').insert(coupling);

  const weekly = mockAnalytics.weeklyActivity.map(w => ({
    week: w.week,
    commits: w.commits,
    files_changed: w.filesChanged,
    lines_added: w.linesAdded,
    lines_removed: w.linesRemoved
  }));
  await supabase.from('analytics_weekly_activity').insert(weekly);

  await supabase.from('analytics_language_distribution').insert(mockAnalytics.languageDistribution);

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error);
