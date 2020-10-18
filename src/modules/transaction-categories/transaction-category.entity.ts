import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { FamilyEntity } from '../families/family.entity';
import { TransactionCategoryTypes } from './transaction-category-types.enum';

@Entity('transaction_categories')
export class TransactionCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ enum: TransactionCategoryTypes })
  type: TransactionCategoryTypes;

  @RelationId((category: TransactionCategoryEntity) => category.family)
  familyId: string;

  @ManyToOne(() => FamilyEntity)
  family: FamilyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
