import { IsUUID, IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class CreateEvaluationDto {
  @IsUUID()
  lessonId!: string;

  @IsUUID()
  instructorId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  steeringScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  parkingScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  reverseParkingScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  roadAwarenessScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  confidenceScore?: number;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  improvements?: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
