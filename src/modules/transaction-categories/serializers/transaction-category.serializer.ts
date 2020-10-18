import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { FamilyEntity } from "src/modules/families/family.entity";
import { TransactionCategoryTypes } from "../transaction-category-types.enum";

export class TransactionCategorySerializer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: TransactionCategoryTypes })
  type: TransactionCategoryTypes;

  @Exclude()
  family: FamilyEntity;

  @Exclude()
  familyId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
