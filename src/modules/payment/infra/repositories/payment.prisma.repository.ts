import { PrismaClient, Payment as PrismaPayment } from "@prisma/client";
import { Payment } from "../../domain/entities/payment.entity";
import { PaymentRepository } from "../../domain/repositories/payment.repository";

export class PaymentPrismaRepository implements PaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(payment: Payment): Promise<Payment> {
    const data = this.toPersistence(payment);
    const record = await this.prisma.payment.create({ data });

    return this.toDomain(record);
  }

  async update(payment: Payment): Promise<Payment> {
    const data = this.toPersistence(payment);
    const record = await this.prisma.payment.update({
      where: { id: payment.id },
      data,
    });

    return this.toDomain(record);
  }

  async findById(id: string): Promise<Payment | null> {
    const record = await this.prisma.payment.findUnique({ where: { id } });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  async list(filters: {
    cpf?: string;
    method?: string;
    status?: string;
  }): Promise<Payment[]> {
    const where = {
      ...(filters.cpf ? { cpf: filters.cpf } : {}),
      ...(filters.method ? { paymentMethod: filters.method } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const records = await this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  private toPersistence(payment: Payment) {
    return {
      id: payment.id,
      cpf: payment.cpf.value,
      description: payment.description,
      amount: payment.amount.value,
      paymentMethod: payment.paymentMethod.value,
      status: payment.status.value,
      preferenceId: payment.preferenceId ?? null,
      externalId: payment.externalId ?? null,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private toDomain(record: PrismaPayment): Payment {
    return Payment.create({
      id: record.id,
      cpf: record.cpf,
      description: record.description,
      amount: record.amount,
      paymentMethod: record.paymentMethod,
      status: record.status,
      preferenceId: record.preferenceId ?? undefined,
      externalId: record.externalId ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
