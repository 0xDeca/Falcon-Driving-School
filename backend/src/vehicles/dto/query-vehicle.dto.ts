import { IsOptional, IsIn } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryVehicleDto extends PaginationDto {
  @IsOptional()
  @IsIn(['available', 'maintenance', 'retired'])
  status?: string;
}
