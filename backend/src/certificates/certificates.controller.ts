import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { QueryCertificateDto } from './dto/query-certificate.dto';

@Controller('certificates')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @Get()
  async findAll(@Query() query: QueryCertificateDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateCertificateDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/approve')
  @Roles('admin')
  async approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Post(':id/reject')
  @Roles('admin')
  async reject(@Param('id') id: string, @Body('notes') notes?: string) {
    return this.service.reject(id, notes);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
