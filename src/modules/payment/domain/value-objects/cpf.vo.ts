const MAX_CPF_LENGTH = 11;

export class Cpf {
  private constructor(private readonly raw: string) {
    Object.freeze(this);
  }

  static create(input: string): Cpf {
    if (!input) {
      throw new Error("CPF is required");
    }

    const digits = input.replace(/\D/g, "");

    if (digits.length !== MAX_CPF_LENGTH) {
      throw new Error("Invalid CPF");
    }

    if (/^(\d)\1{10}$/.test(digits)) {
      throw new Error("Invalid CPF");
    }

    /**
     * @todo Refactor this method to improve readability
     */
    const calculateDigit = (factor: number) => {
      let total = 0;

      for (let i = 0; i < factor - 1; i += 1) {
        total += Number(digits[i]) * (factor - i);
      }

      const remainder = (total * 10) % MAX_CPF_LENGTH;

      return remainder === 10 ? 0 : remainder;
    };

    const verifyDigit1 = calculateDigit(10);
    const verifyDigit2 = calculateDigit(MAX_CPF_LENGTH);

    if (
      verifyDigit1 !== Number(digits[9]) ||
      verifyDigit2 !== Number(digits[10])
    ) {
      throw new Error("Invalid CPF");
    }

    return new Cpf(digits);
  }

  get value(): string {
    return this.raw;
  }
}
