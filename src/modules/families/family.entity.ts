import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('families')
export class FamilyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  totalSalary: number;

  @Column('int')
  passiveIncome: number;

  @Column('int')
  incomePercentageToSavings: number;

  @Column('int')
  balance: number;

  @Column('int')
  flatPrice: number;

  @Column('int')
  flatSquareMeters: number;

  @Column('int', { default: 0 })
  giftsUnpacked: number;

  @Column('int')
  giftsForUnpacking: number;

  @OneToMany(
    () => UserEntity,
    user => user.family,
  )
  members: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
