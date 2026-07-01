import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
