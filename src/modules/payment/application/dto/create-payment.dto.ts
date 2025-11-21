import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
  Matches,
} from "class-validator";

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11,14}$/, {
    message: "cpf must contain 11 or 14 digits",
  })
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(["credit_card", "debit_card", "pix", "boleto"])
  paymentMethod!: string;

  @IsString()
  @IsOptional()
  @IsIn(["pending", "processing", "paid", "failed", "canceled", "refunded"])
  status?: string;

  @IsString()
  @IsOptional()
  preferenceId?: string;

  @IsString()
  @IsOptional()
  externalId?: string;
}
