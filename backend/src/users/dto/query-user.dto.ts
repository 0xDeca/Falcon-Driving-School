import { IsOptional, IsIn } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @IsIn(['admin', 'instructor', 'student'])
  role?: 'admin' | 'instructor' | 'student';
}
