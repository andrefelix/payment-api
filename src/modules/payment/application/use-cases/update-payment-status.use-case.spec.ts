import { UpdatePaymentUseCase } from "./update-payment.usecase";

const createRepositoryMock = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
});

const createPaymentMock = (overrides?: Partial<Record<string, any>>) => ({
  id: "payment-id",
  cpf: { value: "52998224725" },
  description: "Test payment",
  amount: { value: 500 },
  paymentMethod: { value: "pix" },
  status: { value: "pending" },
  preferenceId: "pref-1",
  externalId: "ext-1",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  ...overrides,
});

describe("UpdatePaymentUseCase - Status", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("updates status successfully", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-02T00:00:00.000Z"));
    const repository = createRepositoryMock();
    const existingPayment = createPaymentMock();

    repository.findById.mockResolvedValue(existingPayment);

    const updatedPayment = createPaymentMock({
      status: { value: "paid" },
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    });

    repository.update.mockResolvedValue(updatedPayment);

    const useCase = new UpdatePaymentUseCase(repository as any);

    const result = await useCase.execute(existingPayment.id, {
      status: "paid",
    });

    expect(result).toEqual(updatedPayment);
    expect(repository.findById).toHaveBeenCalledWith(existingPayment.id);
    expect(repository.update).toHaveBeenCalledTimes(1);

    const payload = (repository.update as jest.Mock).mock.calls[0][0];

    expect(payload.status.value).toBe("paid");
    expect(payload.createdAt.getTime()).toBe(
      existingPayment.createdAt.getTime()
    );
    expect(payload.updatedAt.getTime()).toBe(
      new Date("2024-01-02T00:00:00.000Z").getTime()
    );
  });

  it("rejects invalid status transitions", async () => {
    const repository = createRepositoryMock();
    const existingPayment = createPaymentMock();

    repository.findById.mockResolvedValue(existingPayment);

    const useCase = new UpdatePaymentUseCase(repository as any);

    await expect(
      useCase.execute(existingPayment.id, { status: "invalid" })
    ).rejects.toThrow("Invalid payment status");

    expect(repository.update).not.toHaveBeenCalled();
  });

  it("throws when payment is not found", async () => {
    const repository = createRepositoryMock();
    repository.findById.mockResolvedValue(null);

    const useCase = new UpdatePaymentUseCase(repository as any);

    await expect(
      useCase.execute("missing-payment-id", { status: "paid" })
    ).rejects.toThrow("Payment not found");

    expect(repository.update).not.toHaveBeenCalled();
  });
});
