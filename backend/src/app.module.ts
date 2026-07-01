import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { InstructorsModule } from './instructors/instructors.module';
import { CoursesModule } from './courses/courses.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { LessonsModule } from './lessons/lessons.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { PaymentsModule } from './payments/payments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SettingsModule } from './settings/settings.module';
import { BlogModule } from './blog/blog.module';
import { LicensesModule } from './licenses/licenses.module';
import { ContactModule } from './contact/contact.module';
import { StorageModule } from './storage/storage.module';
import { OtpModule } from './otp/otp.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env.production', '.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{ ttl: 60000, limit: config.get<number>('RATE_LIMIT_MAX', 60) }],
      }),
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    InstructorsModule,
    CoursesModule,
    VehiclesModule,
    EnrollmentsModule,
    LessonsModule,
    EvaluationsModule,
    PaymentsModule,
    CertificatesModule,
    NotificationsModule,
    SettingsModule,
    BlogModule,
    LicensesModule,
    ContactModule,
    StorageModule,
    OtpModule,
    DashboardModule,
    AnalyticsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
