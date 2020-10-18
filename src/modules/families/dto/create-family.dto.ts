import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty()
  @IsInt()
  totalSalary: number;

  @ApiProperty()
  @IsInt()
  passiveIncome: number;

  @ApiProperty()
  @IsInt()
  incomePercentageToSavings: number;

  @ApiProperty()
  @IsInt()
  balance: number;

  @ApiProperty()
  @IsInt()
  flatPrice: number;

  @ApiProperty()
  @IsInt()
  flatSquareMeters: number;
}
