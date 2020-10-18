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
import { GetMonthStatsDto } from './dto/get-month-stats.dto';
import { FinanceStatsService } from './finance-stats.service';
import { FlatSavingsStatsSerializer } from './serializers/flat-savings-stats.serializer';
import { MonthStatsSerializer } from './serializers/month-stats.serializer';

@Controller('finance-stats')
@UseGuards(BearerGuard)
@ApiTags('Finance Stats Controller')
@ApiBearerAuth()
export class FinanceStatsController {
  constructor(private financeStatsService: FinanceStatsService) {}

  @Get('annual')
  @ApiOperation({ summary: 'get annual stats' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({
    description: 'Annual stats returned',
    type: MonthStatsSerializer,
    isArray: true,
  })
  async getAnnualStats(
    @DUser() user: UserEntity,
  ): Promise<MonthStatsSerializer[]> {
    return this.financeStatsService.getAnnualStats(user);
  }

  @Get('month')
  @ApiOperation({ summary: 'get month stats' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({
    description: 'Month stats returned',
    type: MonthStatsSerializer,
  })
  async getMonthStats(
    @DUser() user: UserEntity,
    @Query() getMonthStatsDto: GetMonthStatsDto,
  ): Promise<MonthStatsSerializer> {
    return this.financeStatsService.getMonthStats(user, getMonthStatsDto);
  }

  @Get('flat')
  @ApiOperation({ summary: 'get flat savings stats' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiOkResponse({ description: 'Flat savings stats returned' })
  async getFlatSavingsStats(
    @DUser() user: UserEntity,
  ): Promise<FlatSavingsStatsSerializer> {
    return this.financeStatsService.getFlatSavingStats(user);
  }
}
