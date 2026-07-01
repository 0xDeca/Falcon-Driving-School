import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export interface CrudOptions {
  model: keyof PrismaService;
  searchFields?: string[];
  include?: any;
}

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  async findAll(model: string, query: { search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc'; filters?: Record<string, any>; include?: any }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.filters) Object.assign(where, query.filters);

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[query.sortBy || 'createdAt'] = query.sortOrder || 'desc';

    const [data, total] = await Promise.all([
      (this.prisma as any)[model].findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: query.include,
      }),
      (this.prisma as any)[model].count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(model: string, id: string, include?: any) {
    const record = await (this.prisma as any)[model].findUnique({
      where: { id },
      include,
    });
    if (!record) throw new NotFoundException(`${model} not found`);
    return record;
  }

  async create(model: string, data: any) {
    return (this.prisma as any)[model].create({ data });
  }

  async update(model: string, id: string, data: any) {
    await this.findById(model, id);
    return (this.prisma as any)[model].update({ where: { id }, data });
  }

  async delete(model: string, id: string) {
    await this.findById(model, id);
    return (this.prisma as any)[model].delete({ where: { id } });
  }
}
