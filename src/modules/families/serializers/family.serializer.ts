import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/modules/users/user.entity';

export class FamilySerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalSalary: number;

  @ApiProperty()
  passiveIncome: number;

  @ApiProperty()
  incomePercentageToSavings: number;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  flatPrice: number;

  @ApiProperty()
  flatSquareMeters: number;

  @ApiProperty()
  giftsForUnpacking: number;

  @Exclude()
  giftsUnpacked: number;

  @Exclude()
  members: UserEntity[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
