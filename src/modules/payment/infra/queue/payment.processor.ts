import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { UpdatePaymentUseCase } from "../../application/use-cases/update-payment.usecase";
import { PAYMENT_CALLBACK_QUEUE } from "./payment.queue";
import { WorkerLogger } from "../../../../shared/infra/logger/logger.worker";
import { Job } from "bullmq";

type PaymentCallbackJob = {
  paymentId: string;
  status: string;
  externalId?: string;
  preferenceId?: string;
};

@Processor(PAYMENT_CALLBACK_QUEUE)
export class PaymentProcessor extends WorkerHost {
  constructor(
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly workerLogger: WorkerLogger
  ) {
    super();
  }

  async process(job: Job<PaymentCallbackJob>): Promise<void> {
    const { id, name, data, queueName } = job;
    const jobInfo = {
      id,
      name,
      data,
      queueName,
    };

    this.workerLogger.active(jobInfo);

    try {
      const { paymentId, status, externalId, preferenceId } = data;
      const result = await this.updatePaymentUseCase.execute(paymentId, {
        status,
        externalId,
        preferenceId,
      });

      this.workerLogger.completed(jobInfo, result);
    } catch (err) {
      this.workerLogger.failed(jobInfo, err);
      throw err;
    }
  }

  @OnWorkerEvent("failed")
  async onFailed(): Promise<void> {
    return;
  }
}
