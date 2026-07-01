import { IsOptional, IsIn, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryEnrollmentDto extends PaginationDto {
  @IsOptional()
  @IsIn(['active', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsUUID()
  instructorId?: string;
}
