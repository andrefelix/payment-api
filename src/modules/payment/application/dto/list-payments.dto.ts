import { IsIn, IsOptional, IsString, Matches } from "class-validator";

export class ListPaymentsDto {
  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/)
  cpf?: string;

  @IsString()
  @IsOptional()
  @IsIn(["credit_card", "debit_card", "pix", "boleto"])
  method?: string;

  @IsString()
  @IsOptional()
  @IsIn(["pending", "processing", "paid", "failed", "canceled", "refunded"])
  status?: string;
}
