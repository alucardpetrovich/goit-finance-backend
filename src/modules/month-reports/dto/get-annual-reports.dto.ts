import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetAnnualReportsDto {
  @ApiProperty()
  @IsInt()
  endYear: number;

  @ApiProperty()
  @IsInt()
  endMonth: number;
}
