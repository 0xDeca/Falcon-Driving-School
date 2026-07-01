import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getRegistrations(period: string = 'month') {
    const since = new Date();
    if (period === 'week') since.setDate(since.getDate() - 7);
    else if (period === 'month') since.setMonth(since.getMonth() - 1);
    else if (period === 'year') since.setFullYear(since.getFullYear() - 1);

    return this.prisma.student.findMany({
      where: { enrollmentDate: { gte: since } },
      orderBy: { enrollmentDate: 'asc' },
    });
  }

  async getCompletionRate() {
    const total = await this.prisma.enrollment.count();
    const completed = await this.prisma.enrollment.count({ where: { status: 'completed' } });
    return { total, completed, rate: total > 0 ? (completed / total) * 100 : 0 };
  }

  async getPopularCourses() {
    const enrollments = await this.prisma.enrollment.groupBy({
      by: ['courseId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    return enrollments;
  }
}
