import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private redis: RedisService,
    private email: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.fullName,
        password: hashed,
        role: 'student',
      },
    });

    const student = await this.prisma.student.create({
      data: { userId: user.id, phone: dto.phone },
    });

    const tokens = await this.generateTokens(user.id, user.role);

    await this.email.sendWelcome(user.email, user.name || user.email);

    return { user: this.sanitize(user), student, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (user.suspended) throw new UnauthorizedException('Account suspended');

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.generateTokens(user.id, user.role, dto.rememberMe);

    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const cached = await this.redis.get(`refresh:${payload.sub}`);
      if (!cached || cached !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.suspended) throw new UnauthorizedException('Account not found or suspended');

      const tokens = await this.generateTokens(user.id, user.role);
      return { user: this.sanitize(user), ...tokens };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.redis.del(`refresh:${userId}`);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructor: true,
        student: { include: { enrollments: { include: { course: true } } } },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitize(user);
  }

  async sendPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    const token = uuid();
    await this.redis.set(`reset:${token}`, user.id, 3600);

    const resetUrl = `${this.config.get<string>('FRONTEND_URL')}/auth/reset-password?token=${token}`;
    await this.email.sendPasswordReset(user.email, resetUrl);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, password: string) {
    const userId = await this.redis.get(`reset:${token}`);
    if (!userId) throw new UnauthorizedException('Invalid or expired reset token');

    const hashed = await argon2.hash(password);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    await this.redis.del(`reset:${token}`);

    return { message: 'Password reset successful' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await argon2.verify(user.password, currentPassword);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await argon2.hash(newPassword);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    await this.redis.del(`refresh:${userId}`);

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(userId: string, role: string, rememberMe = false) {
    const payload = { sub: userId, role };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: rememberMe ? '30d' : this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const ttl = rememberMe ? 30 * 86400 : 7 * 86400;
    await this.redis.set(`refresh:${userId}`, refreshToken, ttl);

    return { accessToken, refreshToken };
  }

  private sanitize(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
