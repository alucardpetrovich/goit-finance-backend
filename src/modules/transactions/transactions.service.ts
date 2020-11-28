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
import { TransactionTypes } from './transaction-types.enum';

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
    if (!familyId) {
      throw new ForbiddenException('User does not have family yet');
    }

    const { categoryId, comment, amount } = createTransactionDto;
    const category = await this.transactionCategoriesService.getCategoryById(
      categoryId,
    );

    await this.familiesService.updateFamilyBalance(familyId, amount);

    return this.transactionsRepository.save({
      category,
      comment,
      amount,
      family: { id: familyId },
    });
  }

  async createMonthIncomeTransaction(
    familyId: string,
    incomeAmount: number,
  ): Promise<TransactionEntity> {
    return this.transactionsRepository.save({
      amount: incomeAmount,
      type: TransactionTypes.INCOME,
      transactionDate: new Date(),
      family: { id: familyId },
      comment: 'INCOME TRANSACTION',
    });
  }

  async getTransactions({
    familyId,
  }: UserEntity): Promise<TransactionEntity[]> {
    return this.transactionsRepository.find({
      where: { family: { id: familyId } },
      relations: ['category'],
    });
  }

  async getExpensesAmountForMonth(
    familyId: string,
    sqlMonthNum: number,
  ): Promise<number> {
    const { sum } = await this.transactionsRepository
      .createQueryBuilder('t')
      .select('SUM(t.amount)', 'sum')
      .where('"familyId" = :familyId', { familyId })
      .andWhere('EXTRACT(MONTH FROM t.transactionDate) = :month', {
        month: sqlMonthNum,
      })
      .andWhere('type = :type', { type: TransactionTypes.EXPENSE })
      .getRawOne();

    return sum;
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
    user: UserEntity,
  ): Promise<TransactionEntity> {
    const { categoryId, amount } = updateTransactionDto;

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

    if (categoryId) {
      const category = await this.transactionCategoriesService.getCategoryById(
        categoryId,
      );
      paramsToUpdate.category = category;
    }

    const amountDiff = (amount || 0) - transaction.amount;
    if (amountDiff) {
      await this.familiesService.updateFamilyBalance(
        user.familyId,
        -amountDiff,
      );
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
      transaction.amount,
    );

    await this.transactionsRepository.remove(transaction);
  }
}
