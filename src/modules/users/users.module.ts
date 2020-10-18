import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SessionsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
