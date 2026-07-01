import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private client: Resend | null = null;
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.client = new Resend(apiKey);
    }
    this.from = this.config.get<string>('EMAIL_FROM', 'noreply@falcondrivingschool.ng');
  }

  async send(to: string, subject: string, html: string) {
    if (!this.client) {
      this.logger.warn(`Resend not configured — skipping email to ${to}`);
      return;
    }
    try {
      await this.client.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
    }
  }

  async sendWelcome(to: string, name: string) {
    await this.send(
      to,
      'Welcome to Falcon Driving School',
      `<h1>Welcome, ${name}!</h1><p>Your account has been created successfully.</p>`,
    );
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    await this.send(
      to,
      'Reset your password — Falcon Driving School',
      `<h1>Password Reset</h1><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    );
  }

  async sendOtp(to: string, otp: string) {
    await this.send(
      to,
      'Your verification code — Falcon Driving School',
      `<h1>Verification Code</h1><p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 10 minutes.</p>`,
    );
  }
}
