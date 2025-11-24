import { Inject, NotFoundException } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from "../../domain/repositories/payment.repository";
import { AllowedPaymentMethods } from "../../domain/allowed-payment-methods";

type ProcessCreditCardPaymentInput = {
  paymentId: string;
  status: string;
  externalId: string;
  preferenceId: string;
};

export class ProcessCreditCardPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly repository: PaymentRepository
  ) {}

  async execute(input: ProcessCreditCardPaymentInput): Promise<Payment> {
    const payment = await this.repository.findByExternalId(input.externalId);

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.paymentMethod.value !== AllowedPaymentMethods.CREDIT_CARD) {
      throw new Error("Payment method is not credit_card");
    }

    const updated = Payment.create({
      id: payment.id,
      cpf: payment.cpf.value,
      description: payment.description,
      amount: payment.amount.value,
      paymentMethod: payment.paymentMethod.value,
      status: input.status ?? payment.status.value,
      preferenceId: input.preferenceId ?? payment.preferenceId,
      externalId: input.externalId ?? payment.externalId,
      createdAt: payment.createdAt,
      updatedAt: new Date(),
    });

    return this.repository.update(updated);
  }
}
