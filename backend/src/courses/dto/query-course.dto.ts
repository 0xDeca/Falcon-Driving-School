import { IsOptional, IsBoolean } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryCourseDto extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
