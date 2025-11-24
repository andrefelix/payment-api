import { IsIn, IsOptional, IsString, Matches } from "class-validator";
import { AllowedPaymentStatus } from "../../domain/allowed-payment-status";
import { AllowedPaymentMethods } from "../../domain/allowed-payment-methods";

export class ListPaymentsDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/, {
    message: "cpf must contain 11 number digits",
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
