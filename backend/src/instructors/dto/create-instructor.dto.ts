import { IsString, IsOptional, IsUUID, IsInt, Min } from 'class-validator';

export class CreateInstructorDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  certification?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
