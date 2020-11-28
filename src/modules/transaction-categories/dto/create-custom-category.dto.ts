import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCustomCategoryDto {
  @ApiProperty()
  @IsString()
  @Length(2)
  name: string;
}
