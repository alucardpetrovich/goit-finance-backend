import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { FamilyEntity } from '../families/family.entity';

@Entity('month-reports')
export class MonthReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  totalExpenses: number;

  @Column('float')
  totalSavings: number;

  @Column('float')
  totalIncome: number;

  @Column('float')
  expectedSavingsPercentage: number;

  @Column('float')
  expectedSavings: number;

  @Column('date', { default: () => 'CURRENT_DATE' })
  reportDate: Date;

  @ManyToOne(() => FamilyEntity)
  family: FamilyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
