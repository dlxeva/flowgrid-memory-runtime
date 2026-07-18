import type { RuntimeState } from "./domain";

function isRuntimeState(value: unknown): value is RuntimeState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<RuntimeState>;
  return typeof state.projectSlug === "string"
    && typeof state.frame === "string"
    && Array.isArray(state.sources)
    && Array.isArray(state.decisions)
    && Array.isArray(state.proposals)
    && Array.isArray(state.auditEvents);
}

export function parseRuntimeSnapshot(value: unknown): RuntimeState {
  if (!isRuntimeState(value)) {
    throw new Error("The cloud runtime returned an invalid snapshot.");
  }
  return value;
}

export async function loadCloudRuntime(apiUrl: string, projectSlug: string): Promise<RuntimeState> {
  const url = new URL(apiUrl);
  url.searchParams.set("project", projectSlug);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cloud runtime request failed (${response.status}).`);
  return parseRuntimeSnapshot(await response.json());
}
