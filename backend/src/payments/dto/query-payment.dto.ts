import { IsOptional, IsIn, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryPaymentDto extends PaginationDto {
  @IsOptional()
  @IsIn(['pending', 'completed', 'failed', 'refunded'])
  status?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
