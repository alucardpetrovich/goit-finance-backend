import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamiliesService } from '../families/families.service';
import { UserEntity } from '../users/user.entity';
import { GetAnnualReportsDto } from './dto/get-annual-reports.dto';
import { GetMonthReportDto } from './dto/get-month-stats.dto';
import { MonthReportEntity } from './month-report.entity';
import { FlatSavingsReportSerializer } from './serializers/flat-savings-report.serializer';

@Injectable()
export class MonthReportsService {
  constructor(
    @InjectRepository(MonthReportEntity)
    private monthReportsRepository: Repository<MonthReportEntity>,
    private familiesService: FamiliesService,
  ) {}

  async getAnnualStats(
    user: UserEntity,
    { endMonth, endYear }: GetAnnualReportsDto,
  ): Promise<MonthReportEntity[]> {
    const { familyId } = user;
    const endMonthAndYear = `${endYear}-${endMonth}`;
    const startMonthAndYear = `${endYear - 1}-${endMonth}`;

    await this.familiesService.getFamilyInfo(user);

    return this.monthReportsRepository
      .createQueryBuilder()
      .where('"familyId" = :familyId', { familyId })
      .andWhere(`to_char("reportDate", 'YYYY-MM') < :startMonthAndYear`, {
        startMonthAndYear,
      })
      .andWhere(`to_char("reportDate", 'YYYY-MM') >= :endMonthAndYear`, {
        endMonthAndYear,
      })
      .getMany();
  }

  async getMonthStats(
    user: UserEntity,
    { month, year }: GetMonthReportDto,
  ): Promise<MonthReportEntity> {
    const { familyId } = user;
    const monthAndYear = `${year}-${month}`;

    await this.familiesService.getFamilyInfo(user);

    const monthStats = await this.monthReportsRepository
      .createQueryBuilder()
      .where('"familyId" = :familyId', { familyId })
      .andWhere(`to_char("reportDate", 'YYYY-MM') = :monthAndYear`, {
        monthAndYear,
      })
      .getOne();

    if (!monthStats) {
      throw new NotFoundException(`Month report for ${monthAndYear} not found`);
    }

    return monthStats;
  }

  async getFlatSavingStats(
    user: UserEntity,
  ): Promise<FlatSavingsReportSerializer> {
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
}
