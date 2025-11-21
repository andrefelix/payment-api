import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { UpdatePaymentUseCase } from "../../application/use-cases/update-payment.usecase";
import { PAYMENT_CALLBACK_QUEUE } from "./payment.queue";

type PaymentCallbackJob = {
  paymentId: string;
  status: string;
  externalId?: string;
  preferenceId?: string;
};

@Processor(PAYMENT_CALLBACK_QUEUE)
export class PaymentProcessor extends WorkerHost {
  constructor(private readonly updatePaymentUseCase: UpdatePaymentUseCase) {
    super();
  }

  async process(job: { data: PaymentCallbackJob }): Promise<void> {
    const { paymentId, status, externalId, preferenceId } = job.data;

    await this.updatePaymentUseCase.execute(paymentId, {
      status,
      externalId,
      preferenceId,
    });
  }

  @OnWorkerEvent("failed")
  async onFailed(): Promise<void> {
    return;
  }
}
