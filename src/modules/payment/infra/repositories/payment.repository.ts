import { Payment } from "../../domain/entities/payment.entity";

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  list(): Promise<Payment[]>;
}
