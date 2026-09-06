import { mockSessions, type SessionFinding, type TraceSession } from "./mock-data";

const STORAGE_KEY = "traceai.sessions.v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readTraceSessions(): TraceSession[] {
  if (!canUseStorage()) return mockSessions;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockSessions;
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as TraceSession[]) : mockSessions;
  } catch {
    return mockSessions;
  }
}

export function writeTraceSessions(sessions: TraceSession[]) {
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent("traceai:sessions-updated"));
}

export function createTraceSession(input: {
  title: string;
  description: string;
  filesExplored: string[];
  findings: SessionFinding[];
  questionsAsked?: string[];
  isRedacted?: boolean;
}) {
  const now = new Date().toISOString();
  const session: TraceSession = {
    id: `trace-${Date.now()}`,
    title: input.title,
    description: input.description,
    createdAt: now,
    updatedAt: now,
    author: "You",
    authorAvatar: "YO",
    status: "active",
    filesExplored: input.filesExplored,
    questionsAsked: input.questionsAsked ?? [],
    findings: input.findings,
    checkpointId: `ckpt-local-${Date.now().toString(36)}`,
    tags: ["trace", "impact-analysis"],
    isRedacted: input.isRedacted,
  };

  writeTraceSessions([session, ...readTraceSessions()]);
  return session;
}

export function updateTraceSession(id: string, update: Partial<TraceSession>) {
  const sessions = readTraceSessions().map((session) =>
    session.id === id ? { ...session, ...update, updatedAt: new Date().toISOString() } : session,
  );
  writeTraceSessions(sessions);
  return sessions.find((session) => session.id === id);
}
