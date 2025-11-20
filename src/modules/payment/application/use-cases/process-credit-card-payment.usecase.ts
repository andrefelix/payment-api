import { Payment } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

type ProcessCreditCardPaymentInput = {
  paymentId: string;
  status?: string;
  externalId?: string;
  preferenceId?: string;
};

export class ProcessCreditCardPaymentUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(input: ProcessCreditCardPaymentInput): Promise<Payment> {
    const payment = await this.repository.findById(input.paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.paymentMethod.value !== "credit_card") {
      throw new Error("Payment method is not credit_card");
    }

    const updated = Payment.create({
      id: payment.id,
      cpf: payment.cpf.value,
      description: payment.description,
      amount: payment.amount.value,
      paymentMethod: payment.paymentMethod.value,
      status: input.status ?? "processing",
      preferenceId: input.preferenceId ?? payment.preferenceId,
      externalId: input.externalId ?? payment.externalId,
      createdAt: payment.createdAt,
      updatedAt: new Date(),
    });

    return this.repository.update(updated);
  }
}
