import { randomUUID } from "crypto";
import { Amount } from "../value-objects/amount.vo";
import { Cpf } from "../value-objects/cpf.vo";
import { PaymentMethod } from "../value-objects/payment-method.vo";
import { PaymentStatus } from "../value-objects/payment-status.vo";

type PaymentProps = {
  id: string;
  cpf: Cpf;
  description: string;
  amount: Amount;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  preferenceId?: string;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class Payment {
  private constructor(private readonly props: PaymentProps) {
    Object.freeze(this.props);
    Object.freeze(this);
  }

  static create(params: {
    id?: string;
    cpf: string;
    description: string;
    amount: number;
    paymentMethod: string;
    status: string;
    preferenceId?: string;
    externalId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Payment {
    const description = params.description ? params.description.trim() : "";

    if (!description) {
      throw new Error("Description is required");
    }

    const cpf = Cpf.create(params.cpf);
    const amount = Amount.create(params.amount);
    const paymentMethod = PaymentMethod.create(params.paymentMethod);
    const status = PaymentStatus.create(params.status);
    const createdAt = params.createdAt
      ? new Date(params.createdAt)
      : new Date();

    const updatedAt = params.updatedAt ? new Date(params.updatedAt) : createdAt;

    return new Payment({
      id: params.id ?? randomUUID(),
      cpf,
      description,
      amount,
      paymentMethod,
      status,
      preferenceId: params.preferenceId,
      externalId: params.externalId,
      createdAt,
      updatedAt,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get cpf(): Cpf {
    return this.props.cpf;
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): Amount {
    return this.props.amount;
  }

  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get preferenceId(): string | undefined {
    return this.props.preferenceId;
  }

  get externalId(): string | undefined {
    return this.props.externalId;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }
}
