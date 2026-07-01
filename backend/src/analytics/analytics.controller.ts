import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('registrations')
  async getRegistrations(@Query('period') period?: string) {
    return this.service.getRegistrations(period);
  }

  @Get('completion-rate')
  async getCompletionRate() {
    return this.service.getCompletionRate();
  }

  @Get('popular-courses')
  async getPopularCourses() {
    return this.service.getPopularCourses();
  }
}
