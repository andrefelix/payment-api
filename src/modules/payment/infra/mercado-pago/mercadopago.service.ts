import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac, timingSafeEqual } from "crypto";
import {
  PreferenceInput,
  SignatureParts,
  WebhookSignatureInput,
} from "./types/mercadopago.types";

@Injectable()
export class MercadoPagoService {
  private readonly http: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.http = axios.create({
      baseURL: "https://api.mercadopago.com",
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
  }

  async createPreference(input: PreferenceInput): Promise<any> {
    if (!input.items.length) {
      throw new Error("Preference items are required");
    }

    const defaultCurrencyId = "BRL";
    const accessToken = this.getAccessToken();
    const payload = {
      items: input.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        currency_id: item.currencyId ?? defaultCurrencyId,
        unit_price: item.unitPrice,
      })),
      external_reference: input.externalReference,
      notification_url: input.notificationUrl,
      back_urls: input.backUrls,
      metadata: input.metadata,
    };

    const { data } = await this.http.post("/checkout/preferences", payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  }

  validateWebhookSignature(input: WebhookSignatureInput): boolean {
    const secret = this.getWebhookSecret();

    if (!input.signature || !input.requestId) {
      return false;
    }

    const parsed = this.parseSignature(input.signature);

    if (!parsed) {
      return false;
    }

    const body = this.normalizeBody(input.rawBody);
    const signaturePayload = `${input.requestId}:${parsed.ts}:${input.url}:${body}`;
    const expected = createHmac("sha256", secret)
      .update(signaturePayload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expected);
    const providedBuffer = Buffer.from(parsed.v1);

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, providedBuffer);
  }

  private getAccessToken(): string {
    const token = this.configService.get<string>("MERCADOPAGO_ACCESS_TOKEN");

    if (!token) {
      throw new Error("Mercado Pago access token not configured");
    }

    return token;
  }

  private getWebhookSecret(): string {
    const secret = this.configService.get<string>("MERCADOPAGO_WEBHOOK_SECRET");

    if (!secret) {
      throw new Error("Mercado Pago webhook secret not configured");
    }

    return secret;
  }

  private parseSignature(header: string): SignatureParts | null {
    const parts = header.split(",").map((part) => part.trim());
    const ts = parts.find((part) => part.startsWith("ts="))?.split("ts=")[1];
    const v1 = parts.find((part) => part.startsWith("v1="))?.split("v1=")[1];

    if (!ts || !v1) {
      return null;
    }

    return { ts, v1 };
  }

  private normalizeBody(rawBody: string | Buffer): string {
    return typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
  }
}
