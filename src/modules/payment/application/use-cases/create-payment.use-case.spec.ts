import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CreatePaymentUseCase } from "./create-payment.usecase";
import { CreatePixPaymentUseCase } from "./create-pix-payment.usecase";
import { CreateCreditCardPaymentUseCase } from "./create-credit-card-payment.usecase";

describe("CreatePaymentUseCase", () => {
  const pixMock = { execute: jest.fn() };
  const creditCardMock = { execute: jest.fn() };

  const buildModule = () =>
    Test.createTestingModule({
      providers: [
        CreatePaymentUseCase,
        { provide: CreatePixPaymentUseCase, useValue: pixMock },
        { provide: CreateCreditCardPaymentUseCase, useValue: creditCardMock },
      ],
    }).compile();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar createPixPayment.execute quando paymentMethod = "PIX"', async () => {
    const moduleRef = await buildModule();
    const useCase = moduleRef.get<CreatePaymentUseCase>(CreatePaymentUseCase);
    const input = {
      cpf: "52998224725",
      description: "Pix payment",
      amount: 100,
      paymentMethod: "PIX",
      preferenceId: "pref-1",
      externalId: "ext-1",
    };

    pixMock.execute.mockResolvedValue({ id: "pix-payment" });

    const result = await useCase.execute(input);

    expect(pixMock.execute).toHaveBeenCalledWith(input);
    expect(creditCardMock.execute).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "pix-payment" });
  });

  it('deve chamar createCreditCardPayment.execute quando paymentMethod = "CREDIT_CARD"', async () => {
    const moduleRef = await buildModule();
    const useCase = moduleRef.get<CreatePaymentUseCase>(CreatePaymentUseCase);
    const input = {
      cpf: "52998224725",
      description: "Credit card payment",
      amount: 200,
      paymentMethod: "CREDIT_CARD",
      preferenceId: "pref-2",
      externalId: "ext-2",
    };

    creditCardMock.execute.mockResolvedValue({ id: "cc-payment" });

    const result = await useCase.execute(input);

    expect(creditCardMock.execute).toHaveBeenCalledWith(input);
    expect(pixMock.execute).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "cc-payment" });
  });

  it("deve lançar BadRequestException quando o método for inválido", async () => {
    const moduleRef = await buildModule();
    const useCase = moduleRef.get<CreatePaymentUseCase>(CreatePaymentUseCase);
    const input = {
      cpf: "52998224725",
      description: "Invalid payment",
      amount: 300,
      paymentMethod: "BOLETO",
    } as any;

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      BadRequestException
    );

    expect(pixMock.execute).not.toHaveBeenCalled();
    expect(creditCardMock.execute).not.toHaveBeenCalled();
  });
});
