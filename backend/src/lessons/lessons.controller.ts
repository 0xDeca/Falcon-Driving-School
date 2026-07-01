import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { QueryLessonDto } from './dto/query-lesson.dto';

@Controller('lessons')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @Get()
  async findAll(@Query() query: QueryLessonDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateLessonDto) {
    return this.service.create({ ...dto, scheduledDate: new Date(dto.scheduledDate) });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/attendance')
  async recordAttendance(@Param('id') id: string, @Body('status') status: string) {
    return this.service.recordAttendance(id, status);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
