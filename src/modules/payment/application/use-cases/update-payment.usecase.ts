import { Inject, NotFoundException } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from "../../domain/repositories/payment.repository";
import { UpdatePaymentDto } from "../dto/update-payment.dto";

export class UpdatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly repository: PaymentRepository
  ) {}

  async execute(id: string, input: UpdatePaymentDto): Promise<Payment> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException("Payment not found");
    }

    const payment = Payment.create({
      id: existing.id,
      cpf: input.cpf ?? existing.cpf.value,
      description: input.description ?? existing.description,
      amount: input.amount ?? existing.amount.value,
      paymentMethod: input.paymentMethod ?? existing.paymentMethod.value,
      status: input.status ?? existing.status.value,
      preferenceId: input.preferenceId ?? existing.preferenceId,
      externalId: input.externalId ?? existing.externalId,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.repository.update(payment);
  }
}
