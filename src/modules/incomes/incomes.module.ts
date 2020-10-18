import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from '../families/family.entity';
import { ReplenishFamiliesWithIncomeCron } from './replenish-families-with-income.cron';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyEntity])],
  providers: [ReplenishFamiliesWithIncomeCron],
  controllers: [],
  exports: [],
})
export class IncomesModule {}
