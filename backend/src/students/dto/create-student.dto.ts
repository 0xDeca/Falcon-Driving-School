import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsOptional()
  @IsDateString()
  enrollmentDate?: string;
}
