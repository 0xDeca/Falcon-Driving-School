import { IsUUID, IsNumber, IsOptional, IsString, Min, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  studentId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['pending', 'completed', 'failed', 'refunded'])
  status?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
