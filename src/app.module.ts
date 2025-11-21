import { Module } from "@nestjs/common";
import { LoggerModule } from "./shared/infra/logger/logger.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
