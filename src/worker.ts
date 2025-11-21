import { NestFactory } from "@nestjs/core";
import { PaymentWorkerModule } from "./modules/payment/payment-worker.module";

async function bootstrap() {
  await NestFactory.createApplicationContext(PaymentWorkerModule);
}

bootstrap();
