import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: { student: { include: { user: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const record = await this.prisma.payment.findUnique({ where: { id }, include: { student: { include: { user: true } } } });
    if (!record) throw new NotFoundException('Payment not found');
    return record;
  }

  async create(data: { studentId: string; amount: number; paymentMethod?: string; enrollmentId?: string }) {
    const reference = `PAY-${Date.now()}-${uuid().slice(0, 8)}`;
    const payment = await this.prisma.payment.create({
      data: { studentId: data.studentId, amount: data.amount, paymentMethod: data.paymentMethod, reference, status: 'pending' },
    });

    if (data.enrollmentId) {
      await this.prisma.enrollment.update({
        where: { id: data.enrollmentId },
        data: { paid: true },
      });
    }

    return payment;
  }

  async update(id: string, data: any) {
    await this.findById(id);

    if (data.status === 'completed' && !data.reference) {
      data.reference = `PAY-${Date.now()}-${uuid().slice(0, 8)}`;
    }

    return this.prisma.payment.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.payment.delete({ where: { id } });
  }
}
