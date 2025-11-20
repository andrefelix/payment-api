export class Amount {
  private constructor(private readonly raw: number) {
    Object.freeze(this);
  }

  static create(value: number): Amount {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("Invalid amount");
    }

    return new Amount(value);
  }

  get value(): number {
    return this.raw;
  }
}
