import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01, { message: 'Transaction amount should be positive' })
  amount: number;
}
