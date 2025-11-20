import { CreatePaymentUseCase } from "./create-payment.usecase";

const createRepositoryMock = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
});

const createPaymentMock = () => ({
  id: "payment-id",
  cpf: { value: "52998224725" },
  description: "Test payment",
  amount: { value: 1500 },
  paymentMethod: { value: "pix" },
  status: { value: "pending" },
  preferenceId: "pref-1",
  externalId: "ext-1",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
});

describe("CreatePaymentUseCase", () => {
  const validInput = {
    cpf: "52998224725",
    description: "Test payment",
    amount: 1500,
    paymentMethod: "pix",
    preferenceId: "pref-1",
    externalId: "ext-1",
  };

  it("creates a valid payment", async () => {
    const repository = createRepositoryMock();
    const useCase = new CreatePaymentUseCase(repository as any);
    const payment = createPaymentMock();

    repository.create.mockResolvedValue(payment);

    const result = await useCase.execute(validInput);

    expect(result).toEqual(payment);
    expect(repository.create).toHaveBeenCalledTimes(1);

    const createdPayment = (repository.create as jest.Mock).mock.calls[0][0];

    expect(createdPayment.cpf.value).toBe(validInput.cpf);
    expect(createdPayment.description).toBe(validInput.description);
    expect(createdPayment.amount.value).toBe(validInput.amount);
    expect(createdPayment.paymentMethod.value).toBe(validInput.paymentMethod);
    expect(createdPayment.status.value).toBe("pending");
  });

  it("throws when amount is invalid", async () => {
    const repository = createRepositoryMock();
    const useCase = new CreatePaymentUseCase(repository as any);

    await expect(useCase.execute({ ...validInput, amount: 0 })).rejects.toThrow(
      "Invalid amount"
    );

    expect(repository.create).not.toHaveBeenCalled();
  });

  it("throws when cpf is invalid", async () => {
    const repository = createRepositoryMock();
    const useCase = new CreatePaymentUseCase(repository as any);

    await expect(
      useCase.execute({ ...validInput, cpf: "123" })
    ).rejects.toThrow("Invalid CPF");

    expect(repository.create).not.toHaveBeenCalled();
  });
});
