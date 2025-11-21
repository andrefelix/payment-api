import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cors from "cors";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { LoggerService } from "./shared/infra/logger/logger.service";
import { AllExceptionsFilter } from "./shared/infra/filters/all-exceptions.filter";
import { LoggerInterceptor } from "./shared/infra/logger/logger.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new LoggerInterceptor(logger));

  app.use(helmet());
  app.use(cors());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.info(`Application is running on port ${port}`);
}

bootstrap();
