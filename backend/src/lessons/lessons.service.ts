import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;
    if (query.instructorId) where.instructorId = query.instructorId;
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.attendanceStatus) where.attendanceStatus = query.attendanceStatus;
    if (query.fromDate) where.scheduledDate = { gte: new Date(query.fromDate) };
    if (query.toDate) where.scheduledDate = { ...where.scheduledDate, lte: new Date(query.toDate) };

    const [data, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        include: { enrollment: { include: { student: { include: { user: true } }, course: true } }, instructor: { include: { user: true } }, vehicle: true, evaluations: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { scheduledDate: 'asc' },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const record = await this.prisma.lesson.findUnique({
      where: { id },
      include: { enrollment: { include: { student: { include: { user: true } }, course: true } }, instructor: { include: { user: true } }, vehicle: true, evaluations: true },
    });
    if (!record) throw new NotFoundException('Lesson not found');
    return record;
  }

  async create(data: { enrollmentId: string; instructorId: string; scheduledDate: Date; durationMinutes: number; vehicleId?: string }) {
    const scheduled = new Date(data.scheduledDate);
    const endTime = new Date(scheduled.getTime() + data.durationMinutes * 60000);

    const conflict = await this.prisma.lesson.findFirst({
      where: {
        instructorId: data.instructorId,
        scheduledDate: { gte: scheduled, lt: endTime },
        attendanceStatus: { not: 'cancelled' },
      },
    });
    if (conflict) throw new ConflictException('Instructor already has a lesson scheduled at this time');

    if (data.vehicleId) {
      const vehicleConflict = await this.prisma.lesson.findFirst({
        where: {
          vehicleId: data.vehicleId,
          scheduledDate: { gte: scheduled, lt: endTime },
          attendanceStatus: { not: 'cancelled' },
        },
      });
      if (vehicleConflict) throw new ConflictException('Vehicle is already assigned at this time');
    }

    return this.prisma.lesson.create({
      data: {
        enrollmentId: data.enrollmentId,
        instructorId: data.instructorId,
        vehicleId: data.vehicleId,
        scheduledDate: scheduled,
        durationMinutes: data.durationMinutes,
        attendanceStatus: 'scheduled',
      },
      include: { enrollment: true, instructor: { include: { user: true } }, vehicle: true },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async recordAttendance(id: string, status: string) {
    const lesson = await this.findById(id);
    return this.prisma.lesson.update({
      where: { id },
      data: { attendanceStatus: status, startTime: status === 'present' ? new Date() : undefined },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.lesson.delete({ where: { id } });
  }
}
