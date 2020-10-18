import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { TransactionCategoryTypes } from '../transaction-category-types.enum';

export class CreateCustomCategoryDto {
  @ApiProperty()
  @IsString()
  @Length(5)
  name: string;

  @ApiProperty({ enum: TransactionCategoryTypes })
  @IsEnum(TransactionCategoryTypes)
  type: TransactionCategoryTypes;
}
