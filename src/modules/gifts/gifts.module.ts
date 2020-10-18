import { Module } from '@nestjs/common';
import { FamiliesModule } from '../families/families.module';
import { SessionsModule } from '../sessions/sessions.module';
import { GiftsController } from './gifts.controller';

@Module({
  imports: [FamiliesModule, SessionsModule],
  controllers: [GiftsController],
})
export class GiftsModule {}
