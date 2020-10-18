import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionCategoryEntity } from './transaction-category.entity';
import { Repository } from 'typeorm';
import { CreateCustomCategoryDto } from './dto/create-custom-category.dto';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class TransactionCategoriesService {
  constructor(
    @InjectRepository(TransactionCategoryEntity)
    private transactionCategoriesRepository: Repository<
      TransactionCategoryEntity
    >,
  ) {}

  async createCustomCategory(
    { familyId }: UserEntity,
    createCustomCategoryDto: CreateCustomCategoryDto,
  ): Promise<TransactionCategoryEntity> {
    if (!familyId) {
      throw new ForbiddenException('User does not have family yet');
    }

    return this.transactionCategoriesRepository.save({
      ...createCustomCategoryDto,
      family: { id: familyId },
    });
  }

  async getCategories({
    familyId,
  }: UserEntity): Promise<TransactionCategoryEntity[]> {
    return this.transactionCategoriesRepository.find({
      where: [{ family: { id: familyId } }, { family: null }],
    });
  }

  async getCategoryById(
    categoryId: string,
  ): Promise<TransactionCategoryEntity> {
    const category = await this.transactionCategoriesRepository.findOne(
      categoryId,
    );
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }

    return category;
  }
}
