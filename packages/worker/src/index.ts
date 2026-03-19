import { createWorkerRuntime } from "./runtime";

const runtime = createWorkerRuntime();

if (process.argv.includes("--once")) {
  const summaries = await runtime.orchestrator.runOnce();
  runtime.logger.info("worker.once.complete", { jobs: summaries.length });
} else {
  runtime.logger.info("worker.starting", {
    pollIntervalMs: runtime.env.POLL_INTERVAL_MS,
    pollJitterMs: runtime.env.POLL_JITTER_MS,
    virginBaseUrl: runtime.env.VIRGIN_BASE_URL,
    smarketsBaseUrl: runtime.env.SMARKETS_BASE_URL
  });

  await runtime.orchestrator.start();
}
