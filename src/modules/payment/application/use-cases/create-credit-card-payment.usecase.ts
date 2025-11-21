import { Inject } from "@nestjs/common";
import { Payment } from "../../domain/entities/payment.entity";
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from "../../domain/repositories/payment.repository";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { MercadoPagoService } from "../../infra/mercado-pago/mercadopago.service";
import { AllowedPaymentStatus } from "../../domain/allowed-payment-status";

export class CreateCreditCardPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly repository: PaymentRepository,
    private readonly mercadoPagoService: MercadoPagoService
  ) {}

  async execute(input: CreatePaymentDto): Promise<Payment> {
    const payment = Payment.create({
      cpf: input.cpf,
      description: input.description,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: AllowedPaymentStatus.PENDING,
    });

    const created = await this.repository.create(payment);

    const preference = await this.mercadoPagoService.createPreference({
      externalReference: created.id,
      items: [
        {
          title: input.description,
          quantity: 1,
          unitPrice: input.amount,
          currencyId: "BRL",
        },
      ],
    });

    const updated = Payment.create({
      id: created.id,
      cpf: created.cpf.value,
      description: created.description,
      amount: created.amount.value,
      paymentMethod: created.paymentMethod.value,
      status: created.status.value,
      preferenceId: preference.id,
      externalId: preference.collector_id,
      createdAt: created.createdAt,
      updatedAt: new Date(),
    });

    return this.repository.update(updated);
  }
}
