import { Inject, Injectable } from '@nestjs/common';
import { CreateStashLegislationDto } from './dto/create-stash-legislation.dto';
import { UpdateStashLegislationDto } from './dto/update-stash-legislation.dto';
import { StashLegislation } from './entities/stash-legislation.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class StashLegislationService {
  constructor(
    @Inject("STASH_LEGISLATION_REPOSITORY")
    private readonly stashLegislationRespository: typeof StashLegislation,
  ) { }

  async upsert(createStashLegislationDto: CreateStashLegislationDto) {
    return await this.stashLegislationRespository.upsert(
      instanceToPlain(createStashLegislationDto)
    );
  }

  async findOneByLegislationId(id:number) {
    return await this.stashLegislationRespository.findOne({
      where: {
        legislationId: id
      }
    });
  }

  async remove(id: number) {
    return await this.stashLegislationRespository.destroy({
      where: {id}
    });
  }

  async removeByLegislationId(legislationId: number) {
    return await this.stashLegislationRespository.destroy({
      where: {
        legislationId:legislationId
      }
    });
  }


}
