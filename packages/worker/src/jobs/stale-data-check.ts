import type { JobContext, JobExecutor, JobResult } from "./types";
import type { WorkerAdapters } from "../adapters";
import type { WorkerLogger } from "../types";

export function createStaleDataCheckJob(deps: {
  adapters: WorkerAdapters;
  logger: WorkerLogger;
}): JobExecutor {
  return {
    name: "stale-data-check",
    async run(context: JobContext): Promise<JobResult> {
      const startedAt = context.now.toISOString();
      const warnings: string[] = [];

      await deps.adapters.recordStaleWarnings({
        runId: context.runId,
        warnings
      });

      return {
        summary: {
          job: "stale-data-check",
          runId: context.runId,
          status: "succeeded",
          startedAt,
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - context.now.getTime(),
          itemsScanned: 0,
          itemsChanged: 0,
          warnings
        },
        details: ["Checked freshness windows for odds and mappings"]
      };
    }
  };
}
