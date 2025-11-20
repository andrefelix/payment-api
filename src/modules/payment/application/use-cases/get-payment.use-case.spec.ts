import { GetPaymentUseCase } from "./get-payment.usecase";

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

describe("GetPaymentUseCase", () => {
  it("returns an existing payment", async () => {
    const repository = createRepositoryMock();
    const useCase = new GetPaymentUseCase(repository as any);
    const payment = createPaymentMock();

    repository.findById.mockResolvedValue(payment);

    const result = await useCase.execute(payment.id);

    expect(result).toEqual(payment);
    expect(repository.findById).toHaveBeenCalledWith(payment.id);
  });

  it("throws when when payment does not exist", async () => {
    const repository = createRepositoryMock();
    const useCase = new GetPaymentUseCase(repository as any);

    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute("missing-payment-id")).rejects.toThrow(
      "Payment not found"
    );

    expect(repository.findById).toHaveBeenCalledWith("missing-payment-id");
  });
});
