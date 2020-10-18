import { ApiProperty } from '@nestjs/swagger';

export class MonthStatsSerializer {
  @ApiProperty({ description: 'Month and date in format YYYY-MM' })
  monthAndYear: string;

  @ApiProperty()
  income: number;

  @ApiProperty()
  expense: number;

  @ApiProperty()
  expectedSavings: number;
}
