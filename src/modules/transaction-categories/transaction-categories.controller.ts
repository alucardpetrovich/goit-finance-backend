import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { TransactionCategoriesService } from "./transaction-categories.service";
import { BearerGuard } from "src/shared/guards/bearer.guard";
import { ResponseInterceptor } from "src/shared/interceptors/response.interceptor";
import { TransactionCategorySerializer } from "./serializers/transaction-category.serializer";
import { DUser } from "src/shared/decorators/user.decorator";
import { UserEntity } from "../users/user.entity";
import { CreateCustomCategoryDto } from "./dto/create-custom-category.dto";

@Controller("transaction-categories")
@UseGuards(BearerGuard)
@UseInterceptors(new ResponseInterceptor(TransactionCategorySerializer))
@ApiTags("Transaction Categories")
@ApiBearerAuth()
export class TransactionCategoriesController {
  constructor(
    private transactionCategoriesService: TransactionCategoriesService
  ) {}

  @Post("custom")
  @ApiOperation({ summary: "Create new custom category" })
  @ApiBadRequestResponse({ description: "Validation error" })
  @ApiUnauthorizedResponse({ description: "Bearer auth failed" })
  @ApiCreatedResponse({
    description: "Custom transaction category created",
    type: TransactionCategorySerializer,
  })
  async createCustomCategory(
    @DUser() user: UserEntity,
    @Body() createCustomCategoryDto: CreateCustomCategoryDto
  ): Promise<TransactionCategorySerializer> {
    return this.transactionCategoriesService.createCustomCategory(
      user.familyId,
      createCustomCategoryDto
    );
  }

  @Get()
  @ApiUnauthorizedResponse({ description: "Bearer auth failed" })
  @ApiOkResponse({
    description: "Transaction categories returned",
    type: TransactionCategorySerializer,
    isArray: true,
  })
  async getCategories(
    @DUser() user: UserEntity
  ): Promise<TransactionCategorySerializer[]> {
    return this.transactionCategoriesService.getCategories(user.familyId);
  }
}
