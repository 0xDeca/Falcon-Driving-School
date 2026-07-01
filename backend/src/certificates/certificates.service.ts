import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    if (query.courseId) where.courseId = query.courseId;

    const [data, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        include: { student: { include: { user: true } }, course: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const record = await this.prisma.certificate.findUnique({ where: { id }, include: { student: { include: { user: true } }, course: true } });
    if (!record) throw new NotFoundException('Certificate not found');
    return record;
  }

  async create(data: { studentId: string; courseId?: string; adminNotes?: string }) {
    const count = await this.prisma.certificate.count();
    const year = new Date().getFullYear();
    const certNumber = `FDS-${year}-${String(count + 1).padStart(3, '0')}`;

    return this.prisma.certificate.create({
      data: { studentId: data.studentId, courseId: data.courseId, certificateNumber: certNumber, status: 'pending', adminNotes: data.adminNotes },
      include: { student: true, course: true },
    });
  }

  async approve(id: string, adminId?: string) {
    const cert = await this.findById(id);
    if (cert.status !== 'pending') throw new BadRequestException('Certificate is not in pending status');

    return this.prisma.certificate.update({
      where: { id },
      data: { status: 'approved', issueDate: new Date() },
      include: { student: { include: { user: true } }, course: true },
    });
  }

  async reject(id: string, notes?: string) {
    const cert = await this.findById(id);
    if (cert.status !== 'pending') throw new BadRequestException('Certificate is not in pending status');

    return this.prisma.certificate.update({
      where: { id },
      data: { status: 'rejected', adminNotes: notes || cert.adminNotes },
      include: { student: { include: { user: true } }, course: true },
    });
  }

  async update(id: string, data: any) {
    await this.findById(id);
    return this.prisma.certificate.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.certificate.delete({ where: { id } });
  }
}
