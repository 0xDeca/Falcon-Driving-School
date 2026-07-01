import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.studentId) where.studentId = query.studentId;
    if (query.courseId) where.courseId = query.courseId;
    if (query.instructorId) where.instructorId = query.instructorId;

    const [data, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        include: { student: { include: { user: true } }, course: true, instructor: { include: { user: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { enrollmentDate: 'desc' },
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const record = await this.prisma.enrollment.findUnique({
      where: { id },
      include: { student: { include: { user: true } }, course: true, instructor: { include: { user: true } }, lessons: true },
    });
    if (!record) throw new NotFoundException('Enrollment not found');
    return record;
  }

  async create(data: { studentId: string; courseId: string; instructorId?: string }) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: data.studentId, courseId: data.courseId } },
    });
    if (existing) throw new ConflictException('Student is already enrolled in this course');
    return this.prisma.enrollment.create({
      data: { ...data, enrollmentDate: new Date() },
      include: { student: true, course: true },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return this.prisma.enrollment.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.enrollment.delete({ where: { id } });
  }
}
