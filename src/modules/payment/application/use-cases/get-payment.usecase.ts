import { Inject } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from "../../domain/repositories/payment.repository";

export class GetPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly repository: PaymentRepository
  ) {}

  async execute(id: string): Promise<Payment> {
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }
}
