import { loadWorkerEnv } from "./env";
import { createLogger } from "./logger";
import { createVirginClient } from "./clients/virgin";
import { createSmarketsClient } from "./clients/smarkets";
import { createWorkerAdapters } from "./adapters";
import { createVirginOffersSyncJob } from "./jobs/virgin-offers-sync";
import { createVirginOddsSyncJob } from "./jobs/virgin-odds-sync";
import { createSmarketsSyncJob } from "./jobs/smarkets-sync";
import { createCandidateRecomputeJob } from "./jobs/candidate-recompute";
import { createStaleDataCheckJob } from "./jobs/stale-data-check";
import { createWorkerOrchestrator } from "./jobs/orchestrator";

export function createWorkerRuntime() {
  const env = loadWorkerEnv();
  const logger = createLogger(env.LOG_LEVEL);
  const adapters = createWorkerAdapters({
    convexHttpUrl: env.CONVEX_HTTP_URL,
    convexAdminKey: env.CONVEX_ADMIN_KEY,
    logger
  });

  const virgin = createVirginClient({
    baseUrl: env.VIRGIN_BASE_URL,
    timeoutMs: env.HTTP_TIMEOUT_MS,
    bookmakerSlug: "virgin-bet",
    logger
  });

  const smarkets = createSmarketsClient({
    baseUrl: env.SMARKETS_BASE_URL,
    timeoutMs: env.HTTP_TIMEOUT_MS,
    logger
  });

  const jobs = [
    createVirginOffersSyncJob({ virgin, adapters, logger }),
    createVirginOddsSyncJob({ virgin, adapters, logger }),
    createSmarketsSyncJob({ smarkets, adapters, logger }),
    createCandidateRecomputeJob({ adapters, logger }),
    createStaleDataCheckJob({ adapters, logger })
  ];

  return {
    env,
    logger,
    adapters,
    virgin,
    smarkets,
    orchestrator: createWorkerOrchestrator({
      jobs,
      adapters,
      logger,
      pollIntervalMs: env.POLL_INTERVAL_MS,
      pollJitterMs: env.POLL_JITTER_MS
    })
  };
}
