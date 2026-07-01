import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryContactMessageDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  userId?: string;
}
