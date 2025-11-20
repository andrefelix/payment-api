import { Payment } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { ListPaymentsDto } from "../dto/list-payments.dto";

export class ListPaymentsUseCase {
  constructor(private readonly repository: PaymentRepository) {}

  async execute(dto: ListPaymentsDto): Promise<Payment[]> {
    return this.repository.list({
      cpf: dto.cpf,
      method: dto.method,
      status: dto.status,
    });
  }
}
