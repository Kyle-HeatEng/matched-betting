import type { ConvexWorkerClient } from "./clients/convex";
import { createConvexWorkerClient } from "./clients/convex";
import type {
  CanonicalEvent,
  CanonicalMarket,
  CanonicalOutcome,
  JobRunSummary,
  WorkerJobName,
  WorkerLogger,
} from "./types";

export interface WorkerAdapters {
  recordJobRun(summary: JobRunSummary): Promise<void>;
  upsertVirginOffers(input: { runId: string; offerCount: number }): Promise<void>;
  upsertVirginOdds(input: { runId: string; snapshots: number }): Promise<void>;
  upsertSmarketsSnapshots(input: { runId: string; snapshots: number }): Promise<void>;
  triggerCandidateRecompute(input: { runId: string; reason: string; eventIds?: string[] }): Promise<void>;
  recordStaleWarnings(input: { runId: string; warnings: string[] }): Promise<void>;
  publishCanonicalEntities(input: { events: CanonicalEvent[]; markets: CanonicalMarket[]; outcomes: CanonicalOutcome[] }): Promise<void>;
}

async function noop() {
  return;
}

function toRecord(value: Record<string, unknown>): Record<string, unknown>;
function toRecord(value: JobRunSummary): Record<string, unknown>;
function toRecord(value: Record<string, unknown> | JobRunSummary): Record<string, unknown> {
  return value as unknown as Record<string, unknown>;
}

export function createNoopWorkerAdapters(logger: WorkerLogger): WorkerAdapters {
  return {
    async recordJobRun(summary) {
      logger.info("worker.job.run", toRecord(summary));
    },
    async upsertVirginOffers(input) {
      logger.info("worker.upsertVirginOffers", input);
    },
    async upsertVirginOdds(input) {
      logger.info("worker.upsertVirginOdds", input);
    },
    async upsertSmarketsSnapshots(input) {
      logger.info("worker.upsertSmarketsSnapshots", input);
    },
    async triggerCandidateRecompute(input) {
      logger.info("worker.triggerCandidateRecompute", input);
    },
    async recordStaleWarnings(input) {
      logger.info("worker.recordStaleWarnings", input);
    },
    async publishCanonicalEntities() {
      await noop();
    }
  };
}

export function createConvexWorkerAdapters(input: {
  client: ConvexWorkerClient;
  logger: WorkerLogger;
}): WorkerAdapters {
  return {
    async recordJobRun(summary) {
      await input.client.mutation<void>({
        functionName: "worker.recordJobRun",
        args: toRecord(summary)
      });
      input.logger.info("worker.recordJobRun", toRecord(summary));
    },
    async upsertVirginOffers(payload) {
      await input.client.mutation<void>({
        functionName: "worker.upsertVirginOffers",
        args: payload
      });
      input.logger.info("worker.upsertVirginOffers", payload as Record<string, unknown>);
    },
    async upsertVirginOdds(payload) {
      await input.client.mutation<void>({
        functionName: "worker.upsertVirginOdds",
        args: payload
      });
      input.logger.info("worker.upsertVirginOdds", payload as Record<string, unknown>);
    },
    async upsertSmarketsSnapshots(payload) {
      await input.client.mutation<void>({
        functionName: "worker.upsertSmarketsSnapshots",
        args: payload
      });
      input.logger.info("worker.upsertSmarketsSnapshots", payload as Record<string, unknown>);
    },
    async triggerCandidateRecompute(payload) {
      await input.client.mutation<void>({
        functionName: "worker.triggerCandidateRecompute",
        args: payload
      });
      input.logger.info("worker.triggerCandidateRecompute", payload as Record<string, unknown>);
    },
    async recordStaleWarnings(payload) {
      await input.client.mutation<void>({
        functionName: "worker.recordStaleWarnings",
        args: payload
      });
      input.logger.info("worker.recordStaleWarnings", payload as Record<string, unknown>);
    },
    async publishCanonicalEntities(payload) {
      await input.client.mutation<void>({
        functionName: "worker.publishCanonicalEntities",
        args: payload
      });
      input.logger.info("worker.publishCanonicalEntities", {
        events: payload.events.length,
        markets: payload.markets.length,
        outcomes: payload.outcomes.length
      });
    }
  };
}

export function createWorkerAdapters(input: {
  convexHttpUrl?: string;
  convexAdminKey?: string;
  logger: WorkerLogger;
}): WorkerAdapters {
  if (!input.convexHttpUrl) {
    return createNoopWorkerAdapters(input.logger);
  }

  return createConvexWorkerAdapters({
    client: createConvexWorkerClient({
      baseUrl: input.convexHttpUrl,
      timeoutMs: 15_000,
      adminKey: input.convexAdminKey,
      logger: input.logger
    }),
    logger: input.logger
  });
}

export type WorkerAdapterJobName = WorkerJobName;
