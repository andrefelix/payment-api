import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { CreatePaymentUseCase } from "../../application/use-cases/create-payment.usecase";
import { UpdatePaymentUseCase } from "../../application/use-cases/update-payment.usecase";
import { GetPaymentUseCase } from "../../application/use-cases/get-payment.usecase";
import { ListPaymentsUseCase } from "../../application/use-cases/list-payments.use-case";
import { MercadoPagoService } from "../mercado-pago/mercadopago.service";
import { CreatePaymentDto } from "../../application/dto/create-payment.dto";
import { UpdatePaymentDto } from "../../application/dto/update-payment.dto";
import { ListPaymentsDto } from "../../application/dto/list-payments.dto";
import { PaymentQueue, PaymentCallbackJob } from "../queue/payment.queue";

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly paymentQueue: PaymentQueue
  ) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.createPaymentUseCase.execute(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePaymentDto) {
    return this.updatePaymentUseCase.execute(id, dto);
  }

  @Get()
  list(@Query() query: ListPaymentsDto) {
    return this.listPaymentsUseCase.execute(query);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.getPaymentUseCase.execute(id);
  }

  @Post("mercadopago/webhook")
  async handleWebhook(@Req() req: Request) {
    const signature = req.headers["x-signature"] as string;
    const requestId = req.headers["x-request-id"] as string;
    const body = req.body as any;
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const rawBody =
      (req as any).rawBody ??
      (typeof body === "string" ? body : JSON.stringify(body));

    const valid = this.mercadoPagoService.validateWebhookSignature({
      signature,
      requestId,
      url,
      rawBody,
    });

    if (!valid) {
      throw new UnauthorizedException("Invalid webhook signature");
    }

    const paymentId = body.paymentId ?? body.data?.id ?? body.id;
    const status = body.status ?? body.data?.status ?? "processing";
    const externalId = body.externalId ?? body.data?.external_id;
    const preferenceId = body.preferenceId ?? body.data?.preference_id;

    const job: PaymentCallbackJob = {
      paymentId,
      status,
      externalId,
      preferenceId,
    };

    await this.paymentQueue.enqueueCallback(job);

    return { received: true };
  }
}
