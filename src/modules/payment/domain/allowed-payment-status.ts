export enum AllowedPaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAIL = "FAIL",
}

export type AllowedPaymentStatusType = `${AllowedPaymentStatus}`;
