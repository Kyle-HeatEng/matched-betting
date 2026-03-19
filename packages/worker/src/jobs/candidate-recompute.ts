import type { JobContext, JobExecutor, JobResult } from "./types";
import type { WorkerAdapters } from "../adapters";
import type { WorkerLogger } from "../types";

export function createCandidateRecomputeJob(deps: {
  adapters: WorkerAdapters;
  logger: WorkerLogger;
}): JobExecutor {
  return {
    name: "candidate-recompute",
    async run(context: JobContext): Promise<JobResult> {
      const startedAt = context.now.toISOString();
      await deps.adapters.triggerCandidateRecompute({
        runId: context.runId,
        reason: "scheduled-recompute"
      });

      return {
        summary: {
          job: "candidate-recompute",
          runId: context.runId,
          status: "succeeded",
          startedAt,
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - context.now.getTime(),
          itemsScanned: 0,
          itemsChanged: 0,
          warnings: []
        },
        details: ["Triggered candidate recomputation"]
      };
    }
  };
}
