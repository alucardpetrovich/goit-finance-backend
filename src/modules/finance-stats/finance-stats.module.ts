import { Module } from '@nestjs/common';
import { FinanceStatsService } from './finance-stats.service';
import { FinanceStatsController } from './finance-stats.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { FamiliesModule } from '../families/families.module';

@Module({
  imports: [SessionsModule, FamiliesModule],
  providers: [FinanceStatsService],
  controllers: [FinanceStatsController],
})
export class FinanceStatsModule {}
