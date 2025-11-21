import { Injectable } from "@nestjs/common";
import { LoggerService } from "./logger.service";

type WorkerJob = {
  id?: string;
  name?: string;
  data?: Record<string, unknown>;
  queueName?: string;
};

@Injectable()
export class WorkerLogger {
  constructor(private readonly logger: LoggerService) {}

  active(job: WorkerJob): void {
    this.logger.info("Worker job active", {
      queue: job.queueName,
      jobId: job.id,
      name: job.name,
    });
  }

  completed(job: WorkerJob, result?: unknown): void {
    this.logger.info("Worker job completed", {
      queue: job.queueName,
      jobId: job.id,
      name: job.name,
      result,
    });
  }

  failed(job: WorkerJob, error: unknown): void {
    this.logger.error("Worker job failed", {
      queue: job.queueName,
      jobId: job.id,
      name: job.name,
      error: error instanceof Error ? error.message : error,
    });
  }
}
