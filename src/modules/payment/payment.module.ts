import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { LoggerModule } from "../../shared/infra/logger/logger.module";
import { CreatePaymentUseCase } from "./application/use-cases/create-payment.usecase";
import { UpdatePaymentUseCase } from "./application/use-cases/update-payment.usecase";
import { ListPaymentsUseCase } from "./application/use-cases/list-payments.use-case";
import { PAYMENT_REPOSITORY } from "./domain/repositories/payment.repository";
import { PaymentPrismaRepository } from "./infra/repositories/payment.prisma.repository";
import { MercadoPagoService } from "./infra/mercado-pago/mercadopago.service";
import {
  PaymentQueue,
  PAYMENT_CALLBACK_QUEUE,
} from "./infra/queue/payment.queue";
import { PaymentProcessor } from "./infra/queue/payment.processor";
import { WorkerLogger } from "../../shared/infra/logger/logger.worker";
import { PaymentController } from "./infra/controllers/payment.controller";
import { GetPaymentUseCase } from "./application/use-cases/get-payment.usecase";
import { ProcessCreditCardPaymentUseCase } from "./application/use-cases/process-credit-card-payment.usecase";
import { PrismaModule } from "../../shared/infra/database/prisma.module";
import { CreatePixPaymentUseCase } from "./application/use-cases/create-pix-payment.usecase";
import { CreateCreditCardPaymentUseCase } from "./application/use-cases/create-credit-card-payment.usecase";

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    BullModule.registerQueue({
      name: PAYMENT_CALLBACK_QUEUE,
    }),
  ],
  controllers: [PaymentController],
  providers: [
    WorkerLogger,
    GetPaymentUseCase,
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    ListPaymentsUseCase,
    ProcessCreditCardPaymentUseCase,
    MercadoPagoService,
    PaymentQueue,
    PaymentProcessor,
    CreatePixPaymentUseCase,
    CreateCreditCardPaymentUseCase,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentPrismaRepository,
    },
  ],
  exports: [],
})
export class PaymentModule {}
