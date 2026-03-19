import type { JobExecutor } from "./types";
import type { WorkerLogger } from "../types";
import type { JobRunSummary } from "../types";
import type { WorkerAdapters } from "../adapters";

export interface WorkerOrchestrator {
  runOnce(): Promise<JobRunSummary[]>;
  start(): Promise<void>;
  stop(): void;
}

export function createWorkerOrchestrator(input: {
  jobs: JobExecutor[];
  adapters: WorkerAdapters;
  logger: WorkerLogger;
  pollIntervalMs: number;
  pollJitterMs: number;
}): WorkerOrchestrator {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopping = false;

  async function runOnce(): Promise<JobRunSummary[]> {
    const started = new Date();
    const runId = crypto.randomUUID();
    const summaries: JobRunSummary[] = [];

    for (const job of input.jobs) {
      if (stopping) {
        break;
      }

      input.logger.info("worker.job.start", { job: job.name, runId });
      try {
        const result = await job.run({ runId, now: new Date() });
        summaries.push(result.summary);
        input.logger.info("worker.job.finish", result.summary as unknown as Record<string, unknown>);
        try {
          await input.adapters.recordJobRun(result.summary);
        } catch (adapterError) {
          input.logger.error("worker.job.record.failed", {
            job: job.name,
            runId,
            error: adapterError instanceof Error ? adapterError.message : String(adapterError)
          });
        }
      } catch (error) {
        const summary: JobRunSummary = {
          job: job.name,
          runId,
          status: "failed",
          startedAt: started.toISOString(),
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - started.getTime(),
          itemsScanned: 0,
          itemsChanged: 0,
          warnings: [error instanceof Error ? error.message : String(error)]
        };
        summaries.push(summary);
        input.logger.error("worker.job.failed", {
          job: job.name,
          runId,
          error: error instanceof Error ? error.message : String(error)
        });
        try {
          await input.adapters.recordJobRun(summary);
        } catch (adapterError) {
          input.logger.error("worker.job.record.failed", {
            job: job.name,
            runId,
            error: adapterError instanceof Error ? adapterError.message : String(adapterError)
          });
        }
      }
    }

    input.logger.info("worker.cycle.complete", {
      runId,
      startedAt: started.toISOString(),
      finishedAt: new Date().toISOString(),
      jobs: summaries.length
    });

    return summaries;
  }

  function scheduleNext() {
    if (stopping) {
      return;
    }

    const jitter = Math.floor(Math.random() * input.pollJitterMs);
    timer = setTimeout(async () => {
      try {
        await runOnce();
      } catch (error) {
        input.logger.error("worker.cycle.failed", {
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        scheduleNext();
      }
    }, input.pollIntervalMs + jitter);
  }

  return {
    runOnce,
    async start() {
      stopping = false;
      try {
        await runOnce();
      } catch (error) {
        input.logger.error("worker.start.failed", {
          error: error instanceof Error ? error.message : String(error)
        });
      }
      scheduleNext();
    },
    stop() {
      stopping = true;
      if (timer) {
        clearTimeout(timer);
      }
    }
  };
}
