import { Injectable, BadRequestException } from "@nestjs/common";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { CreatePixPaymentUseCase } from "./create-pix-payment.usecase";
import { CreateCreditCardPaymentUseCase } from "./create-credit-card-payment.usecase";
import { AllowedPaymentMethods } from "../../domain/allowed-payment-methods";

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private readonly createPixPayment: CreatePixPaymentUseCase,
    private readonly createCreditCardPayment: CreateCreditCardPaymentUseCase
  ) {}

  async execute(input: CreatePaymentDto) {
    switch (input.paymentMethod) {
      case AllowedPaymentMethods.PIX:
        return this.createPixPayment.execute(input);

      case AllowedPaymentMethods.CREDIT_CARD:
        return this.createCreditCardPayment.execute(input);

      default:
        throw new BadRequestException(
          `Unsupported payment method: ${input.paymentMethod}`
        );
    }
  }
}
