import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DUser } from 'src/shared/decorators/user.decorator';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { UserEntity } from '../users/user.entity';
import { GetAnnualReportsDto } from './dto/get-annual-reports.dto';
import { GetMonthReportDto } from './dto/get-month-stats.dto';
import { MonthReportsService } from './month-reports.service';
import { FlatSavingsReportSerializer } from './serializers/flat-savings-report.serializer';
import { MonthReportSerializer } from './serializers/month-stats.serializer';

@Controller('month-reports')
@UseGuards(BearerGuard)
@ApiTags('Month Reports Controller')
@ApiBearerAuth()
export class MonthReportsController {
  constructor(private monthReportsService: MonthReportsService) {}

  @Get('annual')
  @ApiOperation({ summary: 'get annual month reports' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({
    description: 'Annual month reports returned',
    type: MonthReportSerializer,
    isArray: true,
  })
  async getAnnualStats(
    @DUser() user: UserEntity,
    @Query() getAnnualReportsDto: GetAnnualReportsDto,
  ): Promise<MonthReportSerializer[]> {
    return this.monthReportsService.getAnnualStats(user, getAnnualReportsDto);
  }

  @Get('month')
  @ApiOperation({ summary: 'get month report' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({
    description: 'Month report returned',
    type: MonthReportSerializer,
  })
  async getMonthStats(
    @DUser() user: UserEntity,
    @Query() getMonthReportDto: GetMonthReportDto,
  ): Promise<MonthReportSerializer> {
    return this.monthReportsService.getMonthStats(user, getMonthReportDto);
  }

  @Get('flat')
  @ApiOperation({ summary: 'get flat savings report' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({ description: 'Flat savings report returned' })
  async getFlatSavingsReport(
    @DUser() user: UserEntity,
  ): Promise<FlatSavingsReportSerializer> {
    return this.monthReportsService.getFlatSavingStats(user);
  }
}
