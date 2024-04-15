import { Inject, Injectable } from '@nestjs/common';
import { CreateStashSectionDto } from './dto/create-stash-section.dto';
import { UpdateStashSectionDto } from './dto/update-stash-section.dto';
import { StashSection } from './entities/stash-section.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class StashSectionService {
  constructor(
    @Inject('STASH_SECTION_REPOSITORY')
    private readonly stashSectionRepository: typeof StashSection,
  ) {}

  async upsert(createStashSectionDto: CreateStashSectionDto) {
    return await this.stashSectionRepository.upsert(
      instanceToPlain(createStashSectionDto),
    );
  }

  async findByPK(id: number): Promise<StashSection> {
    return await this.stashSectionRepository.findByPk(id);
  }

  async findAllByDelegatedLegislationId(id: number): Promise<StashSection[]> {
    return await this.stashSectionRepository.findAll({
      where: {
        delegatedLegislationId: id,
      },
    });
  }

  async findAllByLegislationId(id: number): Promise<StashSection[]> {
    return await this.stashSectionRepository.findAll({
      where: {
        legislationId: id,
      },
    });
  }

  async update(id: number, updateObject) {
    const stashSection = await this.stashSectionRepository.findByPk(id);
    if (!stashSection) {
      return null;
    }
    await stashSection.update(updateObject);
    return stashSection;
  }

  async remove(id: number) {
    return await this.stashSectionRepository.destroy({
      where: { id },
    });
  }

  async removeByLegislationId(legislationId: number) {
    return await this.stashSectionRepository.destroy({
      where: {
        legislationId: legislationId,
      },
    });
  }
}
