import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './family.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyEntity]), UsersModule],
  providers: [FamiliesService],
  controllers: [FamiliesController],
  exports: [FamiliesService],
})
export class FamiliesModule {}
