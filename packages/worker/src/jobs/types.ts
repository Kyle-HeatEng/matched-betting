import type { JobRunSummary, WorkerJobName } from "../types";

export interface JobContext {
  runId: string;
  now: Date;
}

export interface JobResult {
  summary: JobRunSummary;
  details: string[];
}

export interface JobExecutor {
  readonly name: WorkerJobName;
  run(context: JobContext): Promise<JobResult>;
}
