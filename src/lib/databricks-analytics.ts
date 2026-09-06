import { mockAnalytics, type AnalyticsData } from "./mock-data";

export type AnalyticsSource = "databricks" | "demo-fallback";

export type AnalyticsSnapshot = {
  data: AnalyticsData;
  source: AnalyticsSource;
  generatedAt: string;
  warning?: string;
};

const endpoint = import.meta.env.VITE_DATABRICKS_ANALYTICS_URL as string | undefined;

function isAnalyticsData(value: unknown): value is AnalyticsData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AnalyticsData>;
  return [
    "changeHeatmap",
    "riskTrends",
    "complexityHotspots",
    "moduleCoupling",
    "weeklyActivity",
    "languageDistribution",
  ].every((key) => Array.isArray(candidate[key as keyof AnalyticsData]));
}

/**
 * Reads a server-side projection of the Databricks analytics tables. The
 * browser never receives a Databricks token; the URL should point to a
 * backend route that runs a parameterized SQL statement and returns the
 * AnalyticsData shape.
 */
export async function loadAnalytics(timeRange: string): Promise<AnalyticsSnapshot> {
  if (!endpoint) {
    return {
      data: mockAnalytics,
      source: "demo-fallback",
      generatedAt: new Date().toISOString(),
      warning: "Databricks is not configured; showing deterministic demo data.",
    };
  }

  try {
    const response = await fetch(`${endpoint}?range=${encodeURIComponent(timeRange)}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`analytics request failed (${response.status})`);
    const payload: unknown = await response.json();
    const data = isAnalyticsData(payload)
      ? payload
      : isAnalyticsData((payload as { data?: unknown })?.data)
        ? (payload as { data: AnalyticsData }).data
        : null;
    if (!data) throw new Error("analytics response has an invalid shape");

    return { data, source: "databricks", generatedAt: new Date().toISOString() };
  } catch (error) {
    return {
      data: mockAnalytics,
      source: "demo-fallback",
      generatedAt: new Date().toISOString(),
      warning: error instanceof Error ? error.message : "Databricks request failed.",
    };
  }
}
