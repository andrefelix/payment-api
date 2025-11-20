import { Payment } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { CreatePaymentDto } from "../dto/create-payment.dto";

export class CreatePaymentUseCase {
  constructor(private readonly repository: PaymentRepository) {}

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
