import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = pino({
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  });
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: false,
  });
  app.useLogger({
    log: (message, ...optionalParams) =>
      logger.info(message, ...optionalParams),
    error: (message, ...optionalParams) =>
      logger.error(message, ...optionalParams),
    warn: (message, ...optionalParams) =>
      logger.warn(message, ...optionalParams),
    debug: (message, ...optionalParams) =>
      logger.debug(message, ...optionalParams),
    verbose: (message, ...optionalParams) =>
      logger.trace(message, ...optionalParams),
  });
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
