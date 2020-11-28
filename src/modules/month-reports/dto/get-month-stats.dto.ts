import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetMonthReportDto {
  @ApiProperty()
  @IsInt()
  year: number;

  @ApiProperty()
  @IsInt()
  month: number;
}
