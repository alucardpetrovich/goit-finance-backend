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

@Entity('transaction_categories')
export class TransactionCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @RelationId((category: TransactionCategoryEntity) => category.family)
  familyId: string;

  @ManyToOne(() => FamilyEntity)
  family: FamilyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
