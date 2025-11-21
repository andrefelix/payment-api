import { Test } from "@nestjs/testing";
import { PAYMENT_REPOSITORY } from "../../domain/repositories/payment.repository";
import { CreateCreditCardPaymentUseCase } from "./create-credit-card-payment.usecase";
import { MercadoPagoService } from "../../infra/mercado-pago/mercadopago.service";
import { Payment } from "../../domain/entities/payment.entity";

describe("CreateCreditCardPaymentUseCase", () => {
  let useCase: CreateCreditCardPaymentUseCase;
  const repository = {
    create: jest.fn(),
    update: jest.fn(),
  };
  const mercadoPago = {
    createPreference: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateCreditCardPaymentUseCase,
        {
          provide: PAYMENT_REPOSITORY,
          useValue: repository,
        },
        {
          provide: MercadoPagoService,
          useValue: mercadoPago,
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreateCreditCardPaymentUseCase);
  });

  it("cria pagamento no Mercado Pago e armazena preferenceId", async () => {
    const input = {
      cpf: "52998224725",
      description: "CC order",
      amount: 2000,
      paymentMethod: "CREDIT_CARD",
    };
    const created = Payment.create({
      cpf: input.cpf,
      description: input.description,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: "PENDING",
    });
    const preference = { id: "pref-123", collector_id: "collector-1" };
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

    repository.create.mockResolvedValue(created);
    mercadoPago.createPreference.mockResolvedValue(preference);
    repository.update.mockResolvedValue(updated);

    const result = await useCase.execute(input as any);

    expect(repository.create).toHaveBeenCalledTimes(1);
    const payloadCreate = repository.create.mock.calls[0][0];
    expect(payloadCreate.paymentMethod.value).toBe("credit_card");
    expect(mercadoPago.createPreference).toHaveBeenCalledTimes(1);
    expect(mercadoPago.createPreference).toHaveBeenCalledWith({
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
    expect(repository.update).toHaveBeenCalledTimes(1);
    const payloadUpdate = repository.update.mock.calls[0][0];
    expect(payloadUpdate.preferenceId).toBe(preference.id);
    expect(payloadUpdate.externalId).toBe(preference.collector_id);
    expect(result).toEqual(updated);
  });

  it("lança erro caso Mercado Pago falhe", async () => {
    const input = {
      cpf: "52998224725",
      description: "CC order",
      amount: 2000,
      paymentMethod: "CREDIT_CARD",
    };
    const created = Payment.create({
      cpf: input.cpf,
      description: input.description,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: "PENDING",
    });

    repository.create.mockResolvedValue(created);
    mercadoPago.createPreference.mockRejectedValue(new Error("mp error"));

    await expect(useCase.execute(input as any)).rejects.toThrow("mp error");

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
