import { ApiProperty } from '@nestjs/swagger';

export class FlatSavingsStatsSerializer {
  @ApiProperty()
  savingsPercentage: number;

  @ApiProperty()
  savingsValue: number;

  @ApiProperty()
  savingsInSquareMeters: number;

  @ApiProperty()
  totalSquareMeters: number;

  @ApiProperty()
  monthsLeftToSaveForFlat: number;

  @ApiProperty()
  savingsForNextSquareMeterLeft: number;

  @ApiProperty()
  giftsForUnpacking: number;
}
