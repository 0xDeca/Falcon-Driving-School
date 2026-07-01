import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async send(userId: string, type: 'email' | 'phone', target: string) {
    const recentCount = await this.prisma.otpCode.count({
      where: { userId, createdAt: { gte: new Date(Date.now() - 60000) } },
    });
    if (recentCount >= 3) {
      throw new BadRequestException('Too many OTP requests. Please wait 1 minute.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { userId, type, target, code, expiresAt },
    });

    if (type === 'email') {
      await this.email.sendOtp(target, code);
    }

    return { message: `OTP sent to ${target}` };
  }

  async verify(userId: string, type: string, code: string) {
    const otp = await this.prisma.otpCode.findFirst({
      where: { userId, type, code, usedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Invalid OTP code');
    if (new Date() > otp.expiresAt) throw new BadRequestException('OTP has expired');
    if (otp.attempts >= 5) throw new BadRequestException('Too many attempts. Request a new OTP.');

    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });

    return { message: 'OTP verified successfully' };
  }
}
