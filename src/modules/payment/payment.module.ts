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

@Module({
  imports: [
    LoggerModule,
    // BullModule.registerQueue({
    //   name: PAYMENT_CALLBACK_QUEUE,
    // }),
  ],
  controllers: [],
  providers: [
    WorkerLogger,
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    ListPaymentsUseCase,
    MercadoPagoService,
    // PaymentQueue,
    // PaymentProcessor,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentPrismaRepository,
    },
  ],
  exports: [],
})
export class PaymentModule {}
