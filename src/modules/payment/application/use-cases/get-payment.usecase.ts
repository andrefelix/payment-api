import { Payment } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

export class GetPaymentUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(id: string): Promise<Payment> {
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }
}
