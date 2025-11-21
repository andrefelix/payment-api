import { Module } from "@nestjs/common";
import { LoggerModule } from "./shared/infra/logger/logger.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./shared/infra/database/prisma.module";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    LoggerModule,
    PrismaModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
