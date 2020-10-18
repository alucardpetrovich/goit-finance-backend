import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserEntity } from '../users/user.entity';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { FamiliesService } from '../families/families.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionsRepository: Repository<TransactionEntity>,
    private transactionCategoriesService: TransactionCategoriesService,
    private familiesService: FamiliesService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    { familyId }: UserEntity,
  ): Promise<TransactionEntity> {
    const { mainCategoryId, subCategoryId, amount } = createTransactionDto;

    const [mainCategory, subCategory] = await Promise.all([
      this.transactionCategoriesService.getCategoryById(mainCategoryId),
      this.transactionCategoriesService.getCategoryById(subCategoryId),
    ]);

    await this.familiesService.updateFamilyBalance(familyId, amount);

    return this.transactionsRepository.save({
      transactionDate: new Date(),
      mainCategory,
      subCategory,
      amount,
      family: { id: familyId },
    });
  }

  async getTransactions({
    familyId,
  }: UserEntity): Promise<TransactionEntity[]> {
    return this.transactionsRepository.find({ family: { id: familyId } });
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
    user: UserEntity,
  ): Promise<TransactionEntity> {
    const { mainCategoryId, subCategoryId, amount } = updateTransactionDto;

    const paramsToUpdate: DeepPartial<TransactionEntity> = {
      ...updateTransactionDto,
    };

    const transaction = await this.transactionsRepository.findOne(
      transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }
    if (transaction.familyId !== user.familyId) {
      throw new ForbiddenException(`User does not owns transaction`);
    }

    if (mainCategoryId) {
      const mainCategory = await this.transactionCategoriesService.getCategoryById(
        mainCategoryId,
      );
      paramsToUpdate.mainCategory = mainCategory;
    }
    if (subCategoryId) {
      const subCategory = await this.transactionCategoriesService.getCategoryById(
        subCategoryId,
      );
      paramsToUpdate.subCategory = subCategory;
    }

    const amountDiff = (amount || 0) - transaction.amount;
    if (amountDiff) {
      await this.familiesService.updateFamilyBalance(user.familyId, amountDiff);
    }

    const transactionToUpdate = this.transactionsRepository.merge(
      transaction,
      paramsToUpdate,
    );

    return this.transactionsRepository.save(transactionToUpdate);
  }

  async deleteTransaction(
    transactionId: string,
    user: UserEntity,
  ): Promise<void> {
    const transaction = await this.transactionsRepository.findOne(
      transactionId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }
    if (transaction.familyId !== user.familyId) {
      throw new ForbiddenException(`User does not owns transaction`);
    }

    await this.familiesService.updateFamilyBalance(
      user.familyId,
      0 - transaction.amount,
    );

    await this.transactionsRepository.remove(transaction);
  }
}
