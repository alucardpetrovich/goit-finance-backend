import { Module } from '@nestjs/common';
import { configModule } from './config/config.module';
import { databaseModule } from './database/database.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TransactionCategoriesModule } from './modules/transaction-categories/transaction-categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TransactionsSummaryModule } from './modules/transactions-summary/transactions-summary.module';
import { FamiliesModule } from './modules/families/families.module';
import { FinanceStatsModule } from './modules/finance-stats/finance-stats.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IncomesModule } from './modules/incomes/incomes.module';

@Module({
  imports: [
    configModule,
    databaseModule,
    ScheduleModule.forRoot(),
    IncomesModule,
    SessionsModule,
    UsersModule,
    TransactionsModule,
    TransactionCategoriesModule,
    AuthModule,
    TransactionsSummaryModule,
    FamiliesModule,
    FinanceStatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
