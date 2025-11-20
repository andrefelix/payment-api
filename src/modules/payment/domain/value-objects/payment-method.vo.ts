export class PaymentMethod {
  private constructor(private readonly raw: string) {
    Object.freeze(this);
  }

  static create(value: string): PaymentMethod {
    const normalized = value ? value.trim().toLowerCase() : "";

    if (!normalized) {
      throw new Error("Payment method is required");
    }

    const allowed = ["credit_card", "debit_card", "pix", "boleto"];

    if (!allowed.includes(normalized)) {
      throw new Error("Invalid payment method");
    }

    return new PaymentMethod(normalized);
  }

  get value(): string {
    return this.raw;
  }
}
