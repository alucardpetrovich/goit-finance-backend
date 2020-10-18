import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyEntity } from '../families/family.entity';

@Injectable()
export class ReplenishFamiliesWithIncomeCron {
  private readonly logger = new Logger(ReplenishFamiliesWithIncomeCron.name);
  private readonly CHUNK_SIZE = 50;

  constructor(
    @InjectRepository(FamilyEntity)
    private familiesRepository: Repository<FamilyEntity>,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async replenishFamiliesWithIncome(): Promise<void> {
    this.logger.debug('cron started');

    let chunkNum = 0;
    let familiesChunk = await this.getFamiliesChunk(chunkNum);

    while (familiesChunk.length) {
      await Promise.all(familiesChunk.map(this.replenishFamily));
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

  private replenishFamily = async (family: FamilyEntity): Promise<void> => {
    await this.familiesRepository
      .createQueryBuilder()
      .where('id = :id', { id: family.id })
      .update(FamilyEntity, {
        balance: () => `"balance" + "totalSalary" + "passiveIncome"`,
        // total giftsEarned - giftsUnpacked
        giftsForUnpacking: () =>
          `FLOOR(balance / flatPrice / squares) - giftsUnpacked`,
      })
      .execute();
  };
}
