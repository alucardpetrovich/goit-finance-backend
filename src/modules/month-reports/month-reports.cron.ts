import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyEntity } from '../families/family.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { MonthReportEntity } from './month-report.entity';

@Injectable()
export class MonthReportCron {
  private readonly logger = new Logger(MonthReportCron.name);
  private readonly CHUNK_SIZE = 50;

  constructor(
    @InjectRepository(FamilyEntity)
    private familiesRepository: Repository<FamilyEntity>,
    @InjectRepository(MonthReportEntity)
    private monthReportsRepository: Repository<MonthReportEntity>,
    private transactionsService: TransactionsService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async replenishFamiliesWithIncome(): Promise<void> {
    this.logger.debug('cron started');

    let chunkNum = 0;
    let familiesChunk = await this.getFamiliesChunk(chunkNum);

    while (familiesChunk.length) {
      await Promise.all(
        familiesChunk.map(async family => {
          const incomeAmount = family.passiveIncome + family.totalSalary;
          await this.replenishFamily(family, incomeAmount);
          await this.transactionsService.createMonthIncomeTransaction(
            family.id,
            incomeAmount,
          );
          await this.createMonthReportRecord(family, incomeAmount);
        }),
      );
      familiesChunk = await this.getFamiliesChunk(++chunkNum);
    }

    this.logger.debug('cron finished');
  }

  private async getFamiliesChunk(chunkNum: number): Promise<FamilyEntity[]> {
    return this.familiesRepository.find({
      skip: chunkNum * this.CHUNK_SIZE,
      take: this.CHUNK_SIZE,
    });
  }

  private async replenishFamily(
    family: FamilyEntity,
    incomeAmount: number,
  ): Promise<void> {
    await this.familiesRepository
      .createQueryBuilder()
      .where('id = :id', { id: family.id })
      .update(FamilyEntity, {
        balance: () => `balance + ${incomeAmount}`,
        // total giftsEarned - giftsUnpacked
        giftsForUnpacking: () =>
          `FLOOR(((balance + ${incomeAmount}) * "flatSquareMeters") / "flatPrice") - "giftsUnpacked"`,
      })
      .execute();
  }

  private async createMonthReportRecord(
    family: FamilyEntity,
    incomeAmount: number,
  ) {
    const { incomePercentageToSavings } = family;
    const prevMonthSql = new Date().getMonth();
    const totalExpenses = await this.transactionsService.getExpensesAmountForMonth(
      family.id,
      prevMonthSql,
    );

    return this.monthReportsRepository.save({
      totalExpenses: totalExpenses,
      totalSavings: _.round(incomeAmount - totalExpenses, 2),
      totalIncome: incomeAmount,
      expectedSavingsPercentage: incomePercentageToSavings,
      expectedSavings: this.getExpectedSavingsPercentage(family),
      family,
    });
  }

  private getExpectedSavingsPercentage(family: FamilyEntity) {
    return _.round(
      ((family.passiveIncome + family.totalSalary) *
        family.incomePercentageToSavings) /
        100,
      2,
    );
  }
}
