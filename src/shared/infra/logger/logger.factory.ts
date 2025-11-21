import pino, { Logger, LoggerOptions } from "pino";

const defaultOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "payment-api" },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};

export const createLogger = (options: LoggerOptions = {}): Logger => {
  return pino({ ...defaultOptions, ...options });
};
