import { IsIn, IsOptional, IsString, Matches } from "class-validator";
import { AllowedPaymentStatus } from "../../domain/allowed-payment-status";
import { AllowedPaymentMethods } from "../../domain/allowed-payment-methods";

export class ListPaymentsDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d{11,14}$/, {
    message: "cpf must contain 11 or 14 digits",
  })
  cpf?: string;

  @IsString()
  @IsOptional()
  @IsIn([AllowedPaymentMethods.PIX, AllowedPaymentMethods.CREDIT_CARD])
  method?: string;

  @IsString()
  @IsOptional()
  @IsIn([
    AllowedPaymentStatus.PENDING,
    AllowedPaymentStatus.PAID,
    AllowedPaymentStatus.FAIL,
  ])
  status?: string;
}
