import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { LoggerService } from "./logger.service";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.logger.info("HTTP request", {
          method,
          url,
          statusCode: response?.statusCode,
          duration: Date.now() - startedAt,
        });
      }),
      catchError((err) => {
        this.logger.error("HTTP error", {
          method,
          url,
          duration: Date.now() - startedAt,
          error: err instanceof Error ? err.message : String(err),
        });
        return throwError(() => err);
      })
    );
  }
}
