import type { LogContext, LogLevel, WorkerLogger } from "./types";

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function scrub(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.length <= 8) {
      return "***";
    }

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
  }

  if (Array.isArray(value)) {
    return value.map(scrub);
  }

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (/token|secret|password|key|cookie/i.test(key)) {
        output[key] = "***";
        continue;
      }
      output[key] = scrub(child);
    }
    return output;
  }

  return value;
}

export function createLogger(level: LogLevel = "info"): WorkerLogger {
  const threshold = LEVEL_WEIGHT[level];

  function write(current: LogLevel, message: string, context?: LogContext) {
    if (LEVEL_WEIGHT[current] < threshold) {
      return;
    }

    const scrubbed = context ? scrub(context) : undefined;
    const entry = {
      ts: new Date().toISOString(),
      level: current,
      message,
      ...(scrubbed && typeof scrubbed === "object" ? scrubbed : {})
    };

    const line = JSON.stringify(entry);
    if (current === "error") {
      console.error(line);
      return;
    }

    if (current === "warn") {
      console.warn(line);
      return;
    }

    console.log(line);
  }

  return {
    debug: (message, context) => write("debug", message, context),
    info: (message, context) => write("info", message, context),
    warn: (message, context) => write("warn", message, context),
    error: (message, context) => write("error", message, context)
  };
}
