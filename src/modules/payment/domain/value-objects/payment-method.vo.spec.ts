import { PaymentMethod } from "./payment-method.vo";

describe("PaymentMethod", () => {
  it("creates a valid payment method", () => {
    const method = PaymentMethod.create("PIX");
    expect(method.value).toBe("PIX");
  });

  it("rejects empty value", () => {
    expect(() => PaymentMethod.create("")).toThrow(
      "Payment method is required"
    );
  });

  it("rejects unknown method", () => {
    expect(() => PaymentMethod.create("cash")).toThrow(
      "Invalid payment method"
    );
  });

  it("enforces immutability", () => {
    const method = PaymentMethod.create("PIX");
    expect(Object.isFrozen(method)).toBe(true);
    expect(() => {
      (method as any).raw = "PIX";
    }).toThrow();
  });

  it("exposes value through getter", () => {
    const method = PaymentMethod.create("PIX");
    expect(method.value).toBe("PIX");
  });
});
