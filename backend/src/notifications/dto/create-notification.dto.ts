import { IsUUID, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsString()
  type!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
