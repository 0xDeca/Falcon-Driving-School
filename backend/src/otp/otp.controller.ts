import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { OtpService } from './otp.service';

class SendOtpDto { type!: 'email' | 'phone'; target!: string; }
class VerifyOtpDto { type!: string; code!: string; }

@Controller('otp')
export class OtpController {
  constructor(private otp: OtpService) {}

  @Post('send')
  @UseGuards(AuthGuard('jwt'))
  send(@Body() dto: SendOtpDto, @Req() req: Request) {
    return this.otp.send((req as any).user.id, dto.type, dto.target);
  }

  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  verify(@Body() dto: VerifyOtpDto, @Req() req: Request) {
    return this.otp.verify((req as any).user.id, dto.type, dto.code);
  }
}
