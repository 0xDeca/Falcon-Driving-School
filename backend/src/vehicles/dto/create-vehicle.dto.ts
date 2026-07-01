import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsString()
  plateNumber!: string;

  @IsOptional()
  @IsIn(['automatic', 'manual'])
  transmissionType?: string;

  @IsOptional()
  @IsDateString()
  insuranceExpiry?: string;

  @IsOptional()
  @IsString()
  maintenanceSchedule?: string;

  @IsOptional()
  @IsIn(['available', 'maintenance', 'retired'])
  status?: string;
}
