import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

export const PAYMENT_CALLBACK_QUEUE = "payment-callback";

export type PaymentCallbackJob = {
  paymentId: string;
  status: string;
  externalId?: string;
  preferenceId?: string;
};

@Injectable()
export class PaymentQueue {
  constructor(
    @InjectQueue(PAYMENT_CALLBACK_QUEUE)
    private readonly queue: Queue
  ) {}

  async enqueueCallback(data: PaymentCallbackJob): Promise<void> {
    await this.queue.add("callback", data);
  }
}
