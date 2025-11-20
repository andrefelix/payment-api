import { ListPaymentsUseCase } from "./list-payments.use-case";

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
  amount: { value: 1500 },
  paymentMethod: { value: "pix" },
  status: { value: "pending" },
  preferenceId: "pref-1",
  externalId: "ext-1",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  ...overrides,
});

describe("ListPaymentsUseCase", () => {
  it("returns filtered payments list", async () => {
    const repository = createRepositoryMock();
    const useCase = new ListPaymentsUseCase(repository as any);
    const filters = { cpf: "52998224725", method: "pix", status: "pending" };
    const payments = [
      createPaymentMock(),
      createPaymentMock({ id: "payment-2" }),
    ];

    repository.list.mockResolvedValue(payments);

    const result = await useCase.execute(filters);

    expect(result).toEqual(payments);
    expect(repository.list).toHaveBeenCalledWith(filters);
  });

  it("returns empty list when no payments match", async () => {
    const repository = createRepositoryMock();
    const useCase = new ListPaymentsUseCase(repository as any);
    const filters = { cpf: undefined, method: undefined, status: undefined };

    repository.list.mockResolvedValue([]);

    const result = await useCase.execute(filters);

    expect(result).toEqual([]);
    expect(repository.list).toHaveBeenCalledWith(filters);
  });
});
