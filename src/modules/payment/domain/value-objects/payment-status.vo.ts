export class PaymentStatus {
  private constructor(private readonly raw: string) {
    Object.freeze(this);
  }

  static create(value: string): PaymentStatus {
    const normalized = value ? value.trim().toLowerCase() : "";

    if (!normalized) {
      throw new Error("Payment status is required");
    }

    const allowed = [
      "pending",
      "processing",
      "paid",
      "failed",
      "canceled",
      "refunded",
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
