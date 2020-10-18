import { ApiProperty } from '@nestjs/swagger';

export class GiftsLeftSerializer {
  @ApiProperty()
  giftsLeft: number;
}
