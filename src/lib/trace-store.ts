import { supabase } from "./supabase";
import type { TraceSession, SessionFinding } from "./types";

export async function readTraceSessions(): Promise<TraceSession[]> {
  const { data: sessionsData, error: sessionsError } = await supabase
    .from("trace_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError);
    return [];
  }

  const { data: findingsData, error: findingsError } = await supabase
    .from("session_findings")
    .select("*");

  if (findingsError) {
    console.error("Error fetching findings:", findingsError);
    return [];
  }

  // Merge findings into sessions
  return sessionsData.map((session) => {
    const sessionFindings = findingsData
      .filter((f) => f.session_id === session.id)
      .map((f) => ({
        type: f.type,
        title: f.title,
        description: f.description,
        affectedFiles: f.affected_files,
        severity: f.severity,
        isRedacted: f.is_redacted,
      }));

    return {
      id: session.id,
      title: session.title,
      description: session.description,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      author: session.author,
      authorAvatar: session.author_avatar,
      status: session.status,
      filesExplored: session.files_explored,
      questionsAsked: session.questions_asked,
      findings: sessionFindings,
      checkpointId: session.checkpoint_id,
      tags: session.tags,
      isRedacted: session.is_redacted,
    } as TraceSession;
  });
}

export async function createTraceSession(input: {
  title: string;
  description: string;
  filesExplored: string[];
  findings: SessionFinding[];
  questionsAsked?: string[];
  isRedacted?: boolean;
}): Promise<TraceSession | null> {
  const now = new Date().toISOString();
  const id = `trace-${Date.now()}`;

  const session = {
    id,
    title: input.title,
    description: input.description,
    created_at: now,
    updated_at: now,
    author: "You",
    author_avatar: "YO",
    status: "active",
    files_explored: input.filesExplored,
    questions_asked: input.questionsAsked ?? [],
    checkpoint_id: `ckpt-local-${Date.now().toString(36)}`,
    tags: ["trace", "impact-analysis"],
    is_redacted: input.isRedacted ?? false,
  };

  const { error } = await supabase.from("trace_sessions").insert(session);

  if (error) {
    console.error("Error creating session:", error);
    return null;
  }

  if (input.findings.length > 0) {
    const findings = input.findings.map((f) => ({
      session_id: id,
      type: f.type,
      title: f.title,
      description: f.description,
      affected_files: f.affectedFiles,
      severity: f.severity,
      is_redacted: f.isRedacted ?? false,
    }));
    await supabase.from("session_findings").insert(findings);
  }

  // Dispatch event so UI can refresh
  window.dispatchEvent(new CustomEvent("traceai:sessions-updated"));

  return {
    ...session,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    authorAvatar: session.author_avatar,
    filesExplored: session.files_explored,
    questionsAsked: session.questions_asked,
    checkpointId: session.checkpoint_id,
    isRedacted: session.is_redacted,
    findings: input.findings,
  } as TraceSession;
}

export async function updateTraceSession(id: string, update: Partial<TraceSession>) {
  const payload: any = { updated_at: new Date().toISOString() };
  if (update.title) payload.title = update.title;
  if (update.description) payload.description = update.description;
  if (update.status) payload.status = update.status;
  
  await supabase.from("trace_sessions").update(payload).eq("id", id);
  window.dispatchEvent(new CustomEvent("traceai:sessions-updated"));
}
