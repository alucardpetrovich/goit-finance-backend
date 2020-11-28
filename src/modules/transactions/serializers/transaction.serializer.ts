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

  @ApiProperty({ type: TransactionCategorySerializer })
  @Type(() => TransactionCategorySerializer)
  category: TransactionCategoryEntity;

  @ApiProperty()
  comment: string;

  @Exclude()
  family: FamilyEntity;

  @Exclude()
  familyId: string;

  @Exclude()
  categoryId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
