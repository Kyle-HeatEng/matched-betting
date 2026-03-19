import type { VirginClient } from "../clients/virgin";
import type { JobContext, JobExecutor, JobResult } from "./types";
import type { WorkerAdapters } from "../adapters";
import type { WorkerLogger } from "../types";

export function createVirginOffersSyncJob(deps: {
  virgin: VirginClient;
  adapters: WorkerAdapters;
  logger: WorkerLogger;
}): JobExecutor {
  return {
    name: "virgin-offers-sync",
    async run(context: JobContext): Promise<JobResult> {
      const startedAt = context.now.toISOString();
      const snapshots = await deps.virgin.fetchOfferSnapshots();
      await deps.adapters.upsertVirginOffers({
        runId: context.runId,
        offerCount: snapshots.length
      });

      return {
        summary: {
          job: "virgin-offers-sync",
          runId: context.runId,
          status: "succeeded",
          startedAt,
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - context.now.getTime(),
          itemsScanned: snapshots.length,
          itemsChanged: snapshots.length,
          warnings: []
        },
        details: [`Fetched ${snapshots.length} Virgin offer snapshot(s)`]
      };
    }
  };
}
