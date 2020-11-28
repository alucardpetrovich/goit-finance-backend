import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { FamilyEntity } from '../families/family.entity';
import { SessionsModule } from '../sessions/sessions.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MonthReportEntity } from './month-report.entity';
import { MonthReportsController } from './month-reports.controller';
import { MonthReportCron } from './month-reports.cron';
import { MonthReportsService } from './month-reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FamilyEntity, MonthReportEntity]),
    TransactionsModule,
    FamiliesModule,
    SessionsModule,
  ],
  providers: [MonthReportCron, MonthReportsService],
  controllers: [MonthReportsController],
  exports: [],
})
export class MonthReportsModule {}
