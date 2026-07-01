import { IsUUID, IsOptional, IsDateString, IsString, IsIn } from 'class-validator';

export class CreateCertificateDto {
  @IsUUID()
  studentId!: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'])
  status?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
