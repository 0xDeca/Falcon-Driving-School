import { IsOptional, IsIn, IsUUID, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryLessonDto extends PaginationDto {
  @IsOptional()
  @IsIn(['scheduled', 'present', 'absent', 'cancelled'])
  attendanceStatus?: string;

  @IsOptional()
  @IsUUID()
  enrollmentId?: string;

  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;
}
