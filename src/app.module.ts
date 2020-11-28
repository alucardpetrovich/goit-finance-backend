import { Module } from '@nestjs/common';
import { configModule } from './config/config.module';
import { databaseModule } from './database/database.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TransactionCategoriesModule } from './modules/transaction-categories/transaction-categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { FamiliesModule } from './modules/families/families.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MonthReportsModule } from './modules/month-reports/month-reports.module';
import { GiftsModule } from './modules/gifts/gifts.module';

@Module({
  imports: [
    configModule,
    databaseModule,
    ScheduleModule.forRoot(),
    MonthReportsModule,
    SessionsModule,
    UsersModule,
    TransactionsModule,
    TransactionCategoriesModule,
    AuthModule,
    FamiliesModule,
    MonthReportsModule,
    GiftsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
