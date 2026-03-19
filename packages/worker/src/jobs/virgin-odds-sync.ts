import type { VirginClient } from "../clients/virgin";
import type { JobContext, JobExecutor, JobResult } from "./types";
import type { WorkerAdapters } from "../adapters";
import type { WorkerLogger } from "../types";

export function createVirginOddsSyncJob(deps: {
  virgin: VirginClient;
  adapters: WorkerAdapters;
  logger: WorkerLogger;
}): JobExecutor {
  return {
    name: "virgin-odds-sync",
    async run(context: JobContext): Promise<JobResult> {
      const startedAt = context.now.toISOString();
      const snapshots = await deps.virgin.fetchOddsSnapshots();
      await deps.adapters.upsertVirginOdds({
        runId: context.runId,
        snapshots: snapshots.length
      });
      await deps.adapters.triggerCandidateRecompute({
        runId: context.runId,
        reason: "virgin-odds-sync"
      });

      return {
        summary: {
          job: "virgin-odds-sync",
          runId: context.runId,
          status: "succeeded",
          startedAt,
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - context.now.getTime(),
          itemsScanned: snapshots.length,
          itemsChanged: snapshots.length,
          warnings: []
        },
        details: [`Fetched ${snapshots.length} Virgin odds snapshot(s)`]
      };
    }
  };
}
