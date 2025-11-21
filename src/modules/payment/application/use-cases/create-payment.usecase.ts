import { Inject } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from "../../domain/repositories/payment.repository";
import { CreatePaymentDto } from "../dto/create-payment.dto";

export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly repository: PaymentRepository
  ) {}

  async execute(input: CreatePaymentDto): Promise<Payment> {
    const defaultStatus = "pending";
    const payment = Payment.create({
      cpf: input.cpf,
      description: input.description,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: input.status ?? defaultStatus,
      preferenceId: input.preferenceId,
      externalId: input.externalId,
    });

    return this.repository.create(payment);
  }
}
