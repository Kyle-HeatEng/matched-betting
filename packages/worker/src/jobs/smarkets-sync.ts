import type { SmarketsClient } from "../clients/smarkets";
import type { JobContext, JobExecutor, JobResult } from "./types";
import type { WorkerAdapters } from "../adapters";
import type { WorkerLogger } from "../types";

export function createSmarketsSyncJob(deps: {
  smarkets: SmarketsClient;
  adapters: WorkerAdapters;
  logger: WorkerLogger;
}): JobExecutor {
  return {
    name: "smarkets-sync",
    async run(context: JobContext): Promise<JobResult> {
      const startedAt = context.now.toISOString();
      const snapshots = await deps.smarkets.fetchMarketSnapshots();
      await deps.adapters.upsertSmarketsSnapshots({
        runId: context.runId,
        snapshots: snapshots.length
      });
      await deps.adapters.triggerCandidateRecompute({
        runId: context.runId,
        reason: "smarkets-sync"
      });

      return {
        summary: {
          job: "smarkets-sync",
          runId: context.runId,
          status: "succeeded",
          startedAt,
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - context.now.getTime(),
          itemsScanned: snapshots.length,
          itemsChanged: snapshots.length,
          warnings: []
        },
        details: [`Fetched ${snapshots.length} Smarkets market snapshot(s)`]
      };
    }
  };
}
