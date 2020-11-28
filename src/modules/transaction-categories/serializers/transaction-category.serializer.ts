import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { FamilyEntity } from "src/modules/families/family.entity";

export class TransactionCategorySerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude()
  family: FamilyEntity;

  @Exclude()
  familyId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
