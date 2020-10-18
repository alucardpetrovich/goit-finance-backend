import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DUser } from 'src/shared/decorators/user.decorator';
import { BearerGuard } from 'src/shared/guards/bearer.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { UserEntity } from '../users/user.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamiliesService } from './families.service';
import { FamilySerializer } from './serializers/family.serializer';

// TODO: Think about stats fetching

@Controller('families')
@UseGuards(BearerGuard)
@UseInterceptors(new ResponseInterceptor(FamilySerializer))
@ApiBearerAuth()
@ApiTags('Families Controller')
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  @Get()
  @ApiOperation({ summary: 'Get family info' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiNotFoundResponse({ description: 'User does not have family yet' })
  @ApiOkResponse({ description: 'Family info returned' })
  async getFamilyInfo(@DUser() user: UserEntity): Promise<FamilySerializer> {
    return this.familiesService.getFamilyInfo(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create family with income and flat data' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiConflictResponse({ description: 'User already created his family' })
  @ApiCreatedResponse({ description: 'Family created', type: FamilySerializer })
  async createFamily(
    @DUser() user: UserEntity,
    @Body() createFamilyDto: CreateFamilyDto,
  ): Promise<FamilySerializer> {
    return this.familiesService.createFamily(createFamilyDto, user);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update user family' })
  @ApiUnauthorizedResponse({ description: 'Bearer auth failed' })
  @ApiNotFoundResponse({ description: 'User does not have family yet' })
  @ApiOkResponse({ description: 'Family updated', type: FamilySerializer })
  async updateCurrentFamily(
    @DUser() user: UserEntity,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ): Promise<FamilySerializer> {
    return this.familiesService.updateFamily(updateFamilyDto, user);
  }
}
