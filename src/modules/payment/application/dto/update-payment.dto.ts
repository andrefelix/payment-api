import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
  Matches,
} from "class-validator";
import { AllowedPaymentStatus } from "../../domain/allowed-payment-status";
import { AllowedPaymentMethods } from "../../domain/allowed-payment-methods";

export class UpdatePaymentDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/, {
    message: "cpf must contain 11 number digits",
  })
  cpf?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  @IsIn([AllowedPaymentMethods.PIX, AllowedPaymentMethods.CREDIT_CARD])
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  @IsIn([
    AllowedPaymentStatus.PENDING,
    AllowedPaymentStatus.PAID,
    AllowedPaymentStatus.FAIL,
  ])
  status?: string;

  @IsString()
  @IsOptional()
  preferenceId?: string;

  @IsString()
  @IsOptional()
  externalId?: string;
}
