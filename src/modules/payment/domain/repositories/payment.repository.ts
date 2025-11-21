import { Payment } from "../entities/payment.entity";

export const PAYMENT_REPOSITORY = Symbol("PAYMENT_REPOSITORY");

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  list(filters: {
    cpf?: string;
    method?: string;
    status?: string;
  }): Promise<Payment[]>;
}
