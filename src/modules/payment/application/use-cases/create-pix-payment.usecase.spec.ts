import { Test } from "@nestjs/testing";
import { PAYMENT_REPOSITORY } from "../../domain/repositories/payment.repository";
import { CreatePixPaymentUseCase } from "./create-pix-payment.usecase";
import { Payment } from "../../domain/entities/payment.entity";

describe("CreatePixPaymentUseCase", () => {
  let useCase: CreatePixPaymentUseCase;
  const repository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreatePixPaymentUseCase,
        {
          provide: PAYMENT_REPOSITORY,
          useValue: repository,
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreatePixPaymentUseCase);
  });

  it("cria pagamento PIX com status 'PENDING'", async () => {
    const input = {
      cpf: "52998224725",
      description: "Pix order",
      amount: 1000,
      paymentMethod: "PIX",
    };
    const created = Payment.create({
      cpf: input.cpf,
      description: input.description,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      status: "PENDING",
    });
    repository.create.mockResolvedValue(created);

    const result = await useCase.execute(input as any);

    expect(repository.create).toHaveBeenCalledTimes(1);
    const payload = repository.create.mock.calls[0][0];
    expect(payload.cpf.value).toBe(input.cpf);
    expect(payload.description).toBe(input.description);
    expect(payload.amount.value).toBe(input.amount);
    expect(payload.status.value).toBe("PENDING");
    expect(result).toEqual(created);
  });

  it("lança erro se DTO estiver inválido", async () => {
    const input = {
      cpf: "52998224725",
      description: "Pix order",
      amount: -1,
      paymentMethod: "PIX",
    } as any;

    try {
      await useCase.execute(input);
      fail("expected to throw");
    } catch (error) {
      expect(error).toBeDefined();
      expect(repository.create).not.toHaveBeenCalled();
    }
  });
});
