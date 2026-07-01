import { IsOptional, IsIn, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryDrivingLicenseDto extends PaginationDto {
  @IsOptional()
  @IsIn(['pending', 'verified', 'rejected'])
  status?: string;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
