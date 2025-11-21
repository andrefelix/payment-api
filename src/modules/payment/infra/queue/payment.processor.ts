import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ProcessCreditCardPaymentUseCase } from "../../application/use-cases/process-credit-card-payment.usecase";
import {
  PAYMENT_CALLBACK_QUEUE,
  PaymentCallbackJob,
} from "./payment.queue";
import { WorkerLogger } from "../../../../shared/infra/logger/logger.worker";

@Processor(PAYMENT_CALLBACK_QUEUE)
export class PaymentProcessor extends WorkerHost {
  constructor(
    private readonly processCreditCardPaymentUseCase: ProcessCreditCardPaymentUseCase,
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
      const result =
        await this.processCreditCardPaymentUseCase.execute({
          paymentId,
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
