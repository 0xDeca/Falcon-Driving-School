import { IsString, IsOptional, IsInt, Min, IsNumber, IsBoolean } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  durationHours!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
