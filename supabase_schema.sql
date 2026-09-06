-- TraceAI Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Graph Nodes
CREATE TABLE graph_nodes (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    language TEXT NOT NULL,
    path TEXT NOT NULL,
    complexity INTEGER NOT NULL,
    change_frequency INTEGER NOT NULL,
    lines_of_code INTEGER NOT NULL,
    risk_score INTEGER NOT NULL,
    dependency_count INTEGER NOT NULL,
    dependent_count INTEGER NOT NULL,
    x REAL,
    y REAL
);

-- 2. Graph Edges
CREATE TABLE graph_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
    target TEXT NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    weight REAL NOT NULL
);

-- 3. Trace Sessions (Checkpoints)
CREATE TABLE trace_sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author TEXT NOT NULL,
    author_avatar TEXT,
    status TEXT NOT NULL,
    files_explored TEXT[] DEFAULT '{}',
    questions_asked TEXT[] DEFAULT '{}',
    checkpoint_id TEXT,
    tags TEXT[] DEFAULT '{}',
    is_redacted BOOLEAN DEFAULT FALSE
);

-- 4. Session Findings
CREATE TABLE session_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL REFERENCES trace_sessions(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    affected_files TEXT[] DEFAULT '{}',
    severity TEXT NOT NULL,
    is_redacted BOOLEAN DEFAULT FALSE
);

-- 5. Impact Reports
CREATE TABLE impact_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_file TEXT NOT NULL,
    target_function TEXT,
    risk_score INTEGER NOT NULL,
    blast_radius INTEGER NOT NULL,
    direct_dependents TEXT[] DEFAULT '{}',
    transitive_dependents TEXT[] DEFAULT '{}',
    affected_tests TEXT[] DEFAULT '{}',
    suggestions TEXT[] DEFAULT '{}',
    severity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Analytics: Heatmap
CREATE TABLE analytics_heatmap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file TEXT NOT NULL,
    day TEXT NOT NULL,
    changes INTEGER NOT NULL
);

-- 7. Analytics: Risk Trends
CREATE TABLE analytics_risk_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TEXT NOT NULL,
    avg_risk INTEGER NOT NULL,
    high_risk_files INTEGER NOT NULL,
    total_files INTEGER NOT NULL
);

-- 8. Analytics: Complexity Hotspots
CREATE TABLE analytics_complexity_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file TEXT NOT NULL,
    complexity INTEGER NOT NULL,
    changes INTEGER NOT NULL,
    bugs INTEGER NOT NULL,
    risk INTEGER NOT NULL
);

-- 9. Analytics: Module Coupling
CREATE TABLE analytics_module_coupling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_a TEXT NOT NULL,
    module_b TEXT NOT NULL,
    coupling_score INTEGER NOT NULL,
    shared_deps INTEGER NOT NULL
);

-- 10. Analytics: Weekly Activity
CREATE TABLE analytics_weekly_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week TEXT NOT NULL,
    commits INTEGER NOT NULL,
    files_changed INTEGER NOT NULL,
    lines_added INTEGER NOT NULL,
    lines_removed INTEGER NOT NULL
);

-- 11. Analytics: Language Distribution
CREATE TABLE analytics_language_distribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    language TEXT NOT NULL,
    files INTEGER NOT NULL,
    percentage REAL NOT NULL,
    color TEXT NOT NULL
);

-- Create simple policies to allow public read/write (for hackathon speed)
-- WARNING: In a real production app, you would enable RLS and restrict this.
-- We are keeping it open so the frontend can easily read/write data for the demo.

ALTER TABLE graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE trace_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_heatmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_risk_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_complexity_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_module_coupling ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_weekly_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_language_distribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all graph_nodes" ON graph_nodes FOR ALL USING (true);
CREATE POLICY "Allow public all graph_edges" ON graph_edges FOR ALL USING (true);
CREATE POLICY "Allow public all trace_sessions" ON trace_sessions FOR ALL USING (true);
CREATE POLICY "Allow public all session_findings" ON session_findings FOR ALL USING (true);
CREATE POLICY "Allow public all impact_reports" ON impact_reports FOR ALL USING (true);
CREATE POLICY "Allow public all analytics_heatmap" ON analytics_heatmap FOR ALL USING (true);
CREATE POLICY "Allow public all analytics_risk_trends" ON analytics_risk_trends FOR ALL USING (true);
CREATE POLICY "Allow public all analytics_complexity_hotspots" ON analytics_complexity_hotspots FOR ALL USING (true);
CREATE POLICY "Allow public all analytics_module_coupling" ON analytics_module_coupling FOR ALL USING (true);
CREATE POLICY "Allow public all analytics_weekly_activity" ON analytics_weekly_activity FOR ALL USING (true);
CREATE POLICY "Allow public all analytics_language_distribution" ON analytics_language_distribution FOR ALL USING (true);
