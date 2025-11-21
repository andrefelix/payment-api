import { AllowedPaymentMethods } from "../allowed-payment-methods";

export class PaymentMethod {
  private constructor(private readonly raw: string) {
    Object.freeze(this);
  }

  static create(value: string): PaymentMethod {
    const normalized = value ? value.trim() : "";

    if (!normalized) {
      throw new Error("Payment method is required");
    }

    const allowed: string[] = [
      AllowedPaymentMethods.PIX,
      AllowedPaymentMethods.CREDIT_CARD,
    ];

    if (!allowed.includes(normalized)) {
      throw new Error("Invalid payment method");
    }

    return new PaymentMethod(normalized);
  }

  get value(): string {
    return this.raw;
  }
}
