import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { FamiliesService } from '../families/families.service';
import { FamilyEntity } from '../families/family.entity';
import { TransactionTypes } from '../transactions/transaction-types.enum';
import { TransactionEntity } from '../transactions/transaction.entity';
import { UserEntity } from '../users/user.entity';
import { GetMonthStatsDto } from './dto/get-month-stats.dto';
import { FlatSavingsStatsSerializer } from './serializers/flat-savings-stats.serializer';
import { MonthStatsSerializer } from './serializers/month-stats.serializer';

@Injectable()
export class FinanceStatsService {
  constructor(
    @InjectConnection()
    private connection: Connection,
    private familiesService: FamiliesService,
  ) {}

  async getAnnualStats(user: UserEntity): Promise<MonthStatsSerializer[]> {
    const { familyId } = user;
    const family = await this.familiesService.getFamilyInfo(user);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const qb = this.connection.createQueryBuilder();

    const result: MonthStatsSerializer[] = await qb
      .select([
        `to_char(sub."transactionDate", 'YYYY-MM') AS "monthAndYear"`,
        `SUM("tIncome") AS income`,
        `SUM("tExpense") AS expense`,
      ])
      .from(
        this.getTransactionCategorizationSubQuery(qb, familyId).getQuery(),
        'sub',
      )
      .where(
        `to_char(sub."transactionDate", 'YYYY-MM') < :currentMonthAndYear`,
        {
          currentMonthAndYear: `${currentYear}-${currentMonth}`,
        },
      )
      .andWhere(
        `to_char(sub."transactionDate", 'YYYY-MM') >= :currentMonthWithYearAgo`,
        {
          currentMonthWithYearAgo: `${currentYear - 1}-${currentMonth}`,
        },
      )
      .groupBy(`to_char(sub."transactionDate", 'YYYY-MM')`)
      .getRawMany();

    return result.map(monthSummary => ({
      ...monthSummary,
      expectedSavings: this.getExpectedSavingsValue(family),
    }));
  }

  async getMonthStats(
    user: UserEntity,
    { month, year }: GetMonthStatsDto,
  ): Promise<MonthStatsSerializer> {
    const { familyId } = user;
    const family = await this.familiesService.getFamilyInfo(user);
    const monthAndYear = `${year}-${month}`;

    const qb = await this.connection.createQueryBuilder();

    const [monthSummary]: MonthStatsSerializer[] = await qb
      .select([
        `to_char(sub."transactionDate", 'YYYY-MM') AS "monthAndYear"`,
        `SUM("tIncome") AS income`,
        `SUM("tExpense") AS expense`,
      ])
      .from(
        this.getTransactionCategorizationSubQuery(qb, familyId)
          .andWhere(`to_char(t."transactionDate", 'YYYY-MM') = :monthAndYear`, {
            monthAndYear,
          })
          .getQuery(),
        'sub',
      )
      .groupBy(`to_char(sub."transactionDate", 'YYYY-MM')`)
      .getRawMany();

    const expectedSavings = this.getExpectedSavingsValue(family);

    return {
      monthAndYear,
      income: monthSummary?.income ?? 0,
      expense: monthSummary?.expense ?? 0,
      expectedSavings,
    };
  }

  async getFlatSavingStats(
    user: UserEntity,
  ): Promise<FlatSavingsStatsSerializer> {
    const family = await this.familiesService.getFamilyInfo(user);

    const squareMeterPrice = Math.floor(
      family.flatPrice / family.flatSquareMeters,
    );
    const totalIncome = family.totalSalary + family.passiveIncome;

    return {
      savingsPercentage: Math.floor((family.balance / family.flatPrice) * 100),
      savingsValue: family.balance,
      savingsInSquareMeters: Math.floor(family.balance / squareMeterPrice),
      totalSquareMeters: family.flatSquareMeters,
      monthsLeftToSaveForFlat: Math.ceil(
        (family.flatPrice - family.balance) / totalIncome,
      ),
      savingsForNextSquareMeterLeft:
        squareMeterPrice - (family.balance % squareMeterPrice),
      giftsForUnpacking: family.giftsForUnpacking,
    };
  }

  private getTransactionCategorizationSubQuery(
    qb: SelectQueryBuilder<any>,
    familyId: string,
  ) {
    return qb
      .subQuery()
      .select([
        't."transactionDate"',
        `(CASE WHEN type = '${TransactionTypes.INCOME}' THEN amount ELSE 0 END) AS "tIncome"`,
        `(CASE WHEN type = '${TransactionTypes.EXPENSE}' THEN amount ELSE 0 END) AS "tExpense"`,
      ])
      .from(TransactionEntity, 't')
      .where('"familyId" = :familyId', { familyId });
  }

  private getExpectedSavingsValue(family: FamilyEntity): number {
    const totalMonthIncome = family.passiveIncome + family.totalSalary;
    return Math.floor(
      (totalMonthIncome * family.incomePercentageToSavings) / 100,
    );
  }
}
