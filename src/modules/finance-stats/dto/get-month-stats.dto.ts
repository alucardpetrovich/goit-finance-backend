import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetMonthStatsDto {
  @ApiProperty()
  @IsInt()
  year: number;

  @ApiProperty()
  @IsInt()
  month: number;
}
