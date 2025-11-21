import { AllowedPaymentStatus } from "../allowed-payment-status";

export class PaymentStatus {
  private constructor(private readonly raw: string) {
    Object.freeze(this);
  }

  static create(value: string): PaymentStatus {
    const normalized = value ? value.trim() : "";

    if (!normalized) {
      throw new Error("Payment status is required");
    }

    const allowed: string[] = [
      AllowedPaymentStatus.PENDING,
      AllowedPaymentStatus.PAID,
      AllowedPaymentStatus.FAIL,
    ];

    if (!allowed.includes(normalized)) {
      throw new Error("Invalid payment status");
    }

    return new PaymentStatus(normalized);
  }

  get value(): string {
    return this.raw;
  }
}
