import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
  mainCategoryId: string;

  @ApiProperty()
  @IsUUID()
  subCategoryId: string;

  @ApiProperty()
  @IsNumber()
  @Max(0, { message: 'Transaction amount should be negative' })
  amount: number;
}
