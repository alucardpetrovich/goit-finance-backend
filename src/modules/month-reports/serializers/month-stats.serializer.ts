import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MonthReportSerializer {
  @Exclude()
  id;

  @ApiProperty()
  totalExpenses: number;

  @ApiProperty()
  totalSavings: number;

  @ApiProperty()
  totalIncome: number;

  @ApiProperty()
  expectedSavingsPercentage: number;

  @ApiProperty()
  expectedSavings: number;

  @ApiProperty()
  reportDate: Date;

  @Exclude()
  family;

  @Exclude()
  createdAt;

  @Exclude()
  updatedAt;
}
