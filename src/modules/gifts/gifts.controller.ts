import { Controller, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DUser } from 'src/shared/decorators/user.decorator';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { FamiliesService } from '../families/families.service';
import { UserEntity } from '../users/user.entity';
import { GiftsLeftSerializer } from './serializers/gifts-left.serializer';

@Controller('gifts')
@UseGuards(BearerGuard)
@ApiTags('Gifts Controller')
@ApiBearerAuth()
export class GiftsController {
  constructor(private familiesService: FamiliesService) {}

  @Patch('unpack')
  @ApiOperation({ summary: 'Unpack families gift' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiForbiddenResponse({ description: 'user does not have family yet' })
  @ApiConflictResponse({ description: 'no gifts to unpack' })
  @ApiOkResponse({ description: 'Gift unpacked', type: GiftsLeftSerializer })
  async unpackGift(@DUser() user: UserEntity): Promise<GiftsLeftSerializer> {
    return this.familiesService.unpackGift(user);
  }
}
