import { IsUUID, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateDrivingLicenseDto {
  @IsUUID()
  studentId!: string;

  @IsString()
  imageUrl!: string;

  @IsOptional()
  @IsIn(['pending', 'verified', 'rejected'])
  status?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
