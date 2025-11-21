import { Module } from "@nestjs/common";
import { LoggerModule } from "./shared/infra/logger/logger.module";

@Module({
  imports: [LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
