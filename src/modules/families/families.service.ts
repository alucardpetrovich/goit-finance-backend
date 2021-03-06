import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamilyEntity } from './family.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(FamilyEntity)
    private familiesRepository: Repository<FamilyEntity>,
    private usersService: UsersService,
  ) {}

  async createFamily(
    createFamilyDto: CreateFamilyDto,
    user: UserEntity,
  ): Promise<FamilyEntity> {
    if (user.familyId) {
      throw new ConflictException(
        `User already created his family (${user.familyId})`,
      );
    }

    const newFamily = await this.familiesRepository.save({
      ...createFamilyDto,
      giftsForUnpacking:
        createFamilyDto.balance /
        (createFamilyDto.flatPrice / createFamilyDto.flatSquareMeters),
    });
    await this.usersService.updateUser(user, { family: newFamily });

    return newFamily;
  }

  async getFamilyInfo({ familyId }: UserEntity): Promise<FamilyEntity> {
    if (!familyId) {
      throw new NotFoundException(`User does not have family yet`);
    }

    return this.familiesRepository.findOne(familyId);
  }

  async updateFamily(
    updateFamilyDto: UpdateFamilyDto,
    user: UserEntity,
  ): Promise<FamilyEntity> {
    const family = await this.familiesRepository.findOne(user.familyId);
    if (!family) {
      throw new NotFoundException('User does not have family yet');
    }

    const paramsToUpdate: DeepPartial<FamilyEntity> = { ...updateFamilyDto };
    if (updateFamilyDto.flatPrice || updateFamilyDto.flatSquareMeters) {
      const giftPrice =
        (updateFamilyDto.flatPrice || family.flatPrice) /
        (updateFamilyDto.flatSquareMeters || family.flatSquareMeters);
      const giftsEarned = Math.floor(family.balance / giftPrice);
      paramsToUpdate.giftsForUnpacking = giftsEarned - family.giftsUnpacked;
    }

    const familyToUpdate = this.familiesRepository.merge(
      family,
      paramsToUpdate,
    );
    return this.familiesRepository.save(familyToUpdate);
  }

  async updateFamilyBalance(familyId: string, amount: number): Promise<void> {
    await this.familiesRepository
      .createQueryBuilder()
      .where('id = :id', { id: familyId })
      .update(FamilyEntity, { balance: () => `balance + ${amount}` })
      .execute();
  }

  async unpackGift({ familyId }: UserEntity): Promise<{ giftsLeft: number }> {
    if (!familyId) {
      throw new ForbiddenException('user does not have family yet');
    }

    const updateResult = await this.familiesRepository
      .createQueryBuilder()
      .where('id = :id', { id: familyId })
      .andWhere('"giftsForUnpacking" > 0')
      .update(FamilyEntity)
      .set({
        giftsUnpacked: () => `"giftsUnpacked" + 1`,
        giftsForUnpacking: () => `"giftsForUnpacking" - 1`,
      })
      .returning('"giftsForUnpacking"')
      .execute();

    if (!updateResult.affected) {
      throw new ConflictException(`There is no gifts no unpack`);
    }

    return { giftsLeft: updateResult.raw[0].giftsForUnpacking };
  }
}
