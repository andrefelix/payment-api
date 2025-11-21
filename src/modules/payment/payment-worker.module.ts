import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "@/shared/infra/database/prisma.module";
import { LoggerModule } from "@/shared/infra/logger/logger.module";
import { BullModule } from "@nestjs/bullmq";

import { PAYMENT_CALLBACK_QUEUE } from "./infra/queue/payment.queue";
import { PaymentProcessor } from "./infra/queue/payment.processor";
import { PaymentPrismaRepository } from "./infra/repositories/payment.prisma.repository";
import { UpdatePaymentUseCase } from "./application/use-cases/update-payment.usecase";
import { PAYMENT_REPOSITORY } from "./domain/repositories/payment.repository";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  providers: [
    PaymentProcessor,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentPrismaRepository,
    },

    UpdatePaymentUseCase,
  ],
})
export class PaymentWorkerModule {}
