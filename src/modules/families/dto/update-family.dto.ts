import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFamilyDto } from './create-family.dto';

export class UpdateFamilyDto extends PartialType(
  OmitType(CreateFamilyDto, ['balance'] as const),
) {}
