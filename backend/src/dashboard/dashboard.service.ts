import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [students, instructors, courses, enrollments, revenue] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.instructor.count(),
      this.prisma.course.count({ where: { archived: false } }),
      this.prisma.enrollment.count({ where: { status: 'active' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
    ]);

    return {
      totalStudents: students,
      totalInstructors: instructors,
      activeCourses: courses,
      activeEnrollments: enrollments,
      totalRevenue: revenue._sum.amount || 0,
    };
  }

  async getRevenueChart(days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const payments = await this.prisma.payment.findMany({
      where: { createdAt: { gte: since }, status: 'completed' },
      orderBy: { createdAt: 'asc' },
    });
    return payments;
  }
}
