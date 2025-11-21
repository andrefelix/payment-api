import { Inject, Injectable } from "@nestjs/common";
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from "../../domain/repositories/payment.repository";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { Payment } from "../../domain/entities/payment.entity";
import { AllowedPaymentStatus } from "../../domain/allowed-payment-status";

@Injectable()
export class CreatePixPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly repository: PaymentRepository
  ) {}

  async execute(input: CreatePaymentDto) {
    const payment = Payment.create({
      cpf: input.cpf,
      description: input.description,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: AllowedPaymentStatus.PENDING,
    });

    return this.repository.create(payment);
  }
}
