import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FamilyEntity } from '../families/family.entity';
import { TransactionCategoryEntity } from '../transaction-categories/transaction-category.entity';
import { TransactionTypes } from './transaction-types.enum';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  amount: number;

  @Column('date', { default: () => 'CURRENT_DATE' })
  transactionDate: Date;

  @Column({ enum: TransactionTypes, default: TransactionTypes.EXPENSE })
  type: TransactionTypes;

  @Column()
  comment: string;

  @RelationId((transaction: TransactionEntity) => transaction.category)
  categoryId: string;

  @ManyToOne(() => TransactionCategoryEntity)
  @JoinColumn()
  category: TransactionCategoryEntity;

  @RelationId((transaction: TransactionEntity) => transaction.family)
  familyId: string;

  @ManyToOne(() => FamilyEntity)
  @JoinColumn()
  family: FamilyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
