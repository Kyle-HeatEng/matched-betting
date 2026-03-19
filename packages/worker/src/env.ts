import type { WorkerEnv } from "./types";

const DEFAULT_POLL_INTERVAL_MS = 120_000;
const DEFAULT_POLL_JITTER_MS = 10_000;
const DEFAULT_HTTP_TIMEOUT_MS = 15_000;

function requirePositiveInteger(value: string | undefined, fallback: number, name: string): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
}

function requireUrl(value: string | undefined, fallback: string, name: string): string {
  const raw = value ?? fallback;
  try {
    return new URL(raw).toString();
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }
}

function requireLogLevel(value: string | undefined): WorkerEnv["LOG_LEVEL"] {
  const normalized = (value ?? "info").toLowerCase();
  if (normalized === "debug" || normalized === "info" || normalized === "warn" || normalized === "error") {
    return normalized;
  }

  throw new Error("LOG_LEVEL must be one of debug, info, warn, error");
}

function requireNodeEnv(value: string | undefined): WorkerEnv["NODE_ENV"] {
  const normalized = value ?? "development";
  if (normalized === "development" || normalized === "test" || normalized === "production") {
    return normalized;
  }

  throw new Error("NODE_ENV must be development, test, or production");
}

export function loadWorkerEnv(env: Record<string, string | undefined> = Bun.env): WorkerEnv {
  return {
    NODE_ENV: requireNodeEnv(env.NODE_ENV),
    POLL_INTERVAL_MS: requirePositiveInteger(env.POLL_INTERVAL_MS, DEFAULT_POLL_INTERVAL_MS, "POLL_INTERVAL_MS"),
    POLL_JITTER_MS: requirePositiveInteger(env.POLL_JITTER_MS, DEFAULT_POLL_JITTER_MS, "POLL_JITTER_MS"),
    HTTP_TIMEOUT_MS: requirePositiveInteger(env.HTTP_TIMEOUT_MS, DEFAULT_HTTP_TIMEOUT_MS, "HTTP_TIMEOUT_MS"),
    VIRGIN_BASE_URL: requireUrl(env.VIRGIN_BASE_URL, "https://www.virginbet.com", "VIRGIN_BASE_URL"),
    SMARKETS_BASE_URL: requireUrl(env.SMARKETS_BASE_URL, "https://api.smarkets.com/v3", "SMARKETS_BASE_URL"),
    CONVEX_HTTP_URL: env.CONVEX_HTTP_URL ? requireUrl(env.CONVEX_HTTP_URL, env.CONVEX_HTTP_URL, "CONVEX_HTTP_URL") : undefined,
    CONVEX_ADMIN_KEY: env.CONVEX_ADMIN_KEY || undefined,
    SECRET_ENCRYPTION_KEY: env.SECRET_ENCRYPTION_KEY || undefined,
    LOG_LEVEL: requireLogLevel(env.LOG_LEVEL)
  };
}
