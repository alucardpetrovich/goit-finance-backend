import { Module } from '@nestjs/common';
import { FinanceStatsService } from './finance-stats.service';
import { FinanceStatsController } from './finance-stats.controller';

@Module({
  providers: [FinanceStatsService],
  controllers: [FinanceStatsController]
})
export class FinanceStatsModule {}
