import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { FamilyEntity } from 'src/modules/families/family.entity';
import { TransactionCategorySerializer } from 'src/modules/transaction-categories/serializers/transaction-category.serializer';
import { TransactionCategoryEntity } from 'src/modules/transaction-categories/transaction-category.entity';
import { TransactionTypes } from '../transaction-types.enum';

export class TransactionSerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  transactionDate: Date;

  @ApiProperty()
  type: TransactionTypes;

  @ApiProperty()
  @Type(() => TransactionCategorySerializer)
  mainCategory: TransactionCategoryEntity;

  @ApiProperty()
  @Type(() => TransactionCategorySerializer)
  subCategory: TransactionCategoryEntity;

  @Exclude()
  family: FamilyEntity;

  @Exclude()
  familyId: string;

  @Exclude()
  mainCategoryId: string;

  @Exclude()
  subCategoryId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
