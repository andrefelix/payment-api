import { Injectable } from "@nestjs/common";
import { LoggerService } from "./logger.service";

@Injectable()
export class ExternalLogger {
  constructor(private readonly logger: LoggerService) {}

  request(service: string, payload?: Record<string, unknown>): void {
    this.logger.info("External request", { service, payload });
  }

  response(
    service: string,
    status: number,
    payload?: Record<string, unknown>
  ): void {
    this.logger.info("External response", { service, status, payload });
  }

  error(
    service: string,
    message: string,
    payload?: Record<string, unknown>
  ): void {
    this.logger.error("External error", { service, message, payload });
  }
}
