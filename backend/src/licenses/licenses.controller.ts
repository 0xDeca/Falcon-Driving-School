import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LicensesService } from './licenses.service';
import { CreateDrivingLicenseDto } from './dto/create-driving-license.dto';
import { UpdateDrivingLicenseDto } from './dto/update-driving-license.dto';
import { QueryDrivingLicenseDto } from './dto/query-driving-license.dto';

@Controller('licenses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LicensesController {
  constructor(private readonly service: LicensesService) {}

  @Get()
  async findAll(@Query() query: QueryDrivingLicenseDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateDrivingLicenseDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDrivingLicenseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
