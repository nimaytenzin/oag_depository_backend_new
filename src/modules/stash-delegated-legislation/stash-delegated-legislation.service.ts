import { Inject, Injectable } from '@nestjs/common';
import { CreateStashDelegatedLegislationDto } from './dto/create-stash-delegated-legislation.dto';
import { UpdateStashDelegatedLegislationDto } from './dto/update-stash-delegated-legislation.dto';
import { StashDelegatedLegislation } from './entities/stash-delegated-legislation.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class StashDelegatedLegislationService {
  constructor(
    @Inject("STASH_DELEGATED_LEGISLATION_REPOSITORY")
    private readonly stashDelegatedLegislationRepository: typeof StashDelegatedLegislation,
  ) { }

  async upsert(createStashLegislationDto: CreateStashDelegatedLegislationDto) {
    return await this.stashDelegatedLegislationRepository.upsert(
      instanceToPlain(createStashLegislationDto)
    );
  }

  async findOneByDelegatedLegislationId(id:number) {
    return await this.stashDelegatedLegislationRepository.findOne({
      where: {
        delegatedLegislationId: id
      }
    });
  }

  async remove(id: number) {
    return await this.stashDelegatedLegislationRepository.destroy({
      where: {id}
    });
  }

  async removeByLegislationId(delegatedLegislationId: number) {
    return await this.stashDelegatedLegislationRepository.destroy({
      where: {
        delegatedLegislation:delegatedLegislationId
      }
    });
  }
}
