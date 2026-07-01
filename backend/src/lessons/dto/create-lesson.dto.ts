import { IsUUID, IsInt, Min, IsDateString, IsOptional, IsIn } from 'class-validator';

export class CreateLessonDto {
  @IsUUID()
  enrollmentId!: string;

  @IsUUID()
  instructorId!: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsDateString()
  scheduledDate!: string;

  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @IsOptional()
  @IsIn(['scheduled', 'present', 'absent', 'cancelled'])
  attendanceStatus?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
