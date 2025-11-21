export type PreferenceItem = {
  id?: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number; // maps to unit_price
  pictureUrl?: string; // maps to picture_url
  categoryId?: string; // maps to category_id
  currencyId?: string; // maps to currency_id (default: BRL)
};

export type PreferencePayer = {
  name?: string;
  surname?: string;
  email?: string;
  phone?: {
    areaCode?: string;
    number?: string;
  };
  identification?: {
    type?: string; // CPF, CNPJ, DNI, etc.
    number?: string;
  };
};

export type PreferenceBackUrls = {
  success?: string;
  failure?: string;
  pending?: string;
};

export type PreferenceAdvancedOptions = {
  autoReturn?: "approved" | "all";
  expires?: boolean;
  expirationDateFrom?: string; // ISO-8601
  expirationDateTo?: string; // ISO-8601
};

export type PreferenceInput = {
  items: PreferenceItem[];
  payer?: PreferencePayer;
  externalReference?: string;
  notificationUrl?: string;
  backUrls?: PreferenceBackUrls;
  metadata?: Record<string, unknown>;
  advancedOptions?: PreferenceAdvancedOptions;
};

export type PreferenceResponse = {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
  items: {
    id?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    currencyId: string;
  }[];
  externalReference?: string;
  metadata?: Record<string, unknown>;
};

export type MercadoPagoWebhookData = {
  id: string;
  liveMode: boolean;
  type: "payment" | "plan" | "subscription" | "merchant_order";
  dateCreated: string;
  applicationId?: number;
  userId: number;
  version: number;
  apiVersion: string;
  action: string;
  data: {
    id: string; // payment id
  };
};

export type WebhookSignatureInput = {
  signature: string; // header "X-Signature"
  requestId: string; // header "X-Request-Id"
  url: string; // full URL path
  rawBody: string | Buffer; // body enviado pelo Mercado Pago
};

export type SignatureParts = {
  ts: string; // timestamp enviado pelo Mercado Pago
  v1: string; // hash esperado
};
