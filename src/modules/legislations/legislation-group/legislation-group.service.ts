import { Inject, Injectable } from '@nestjs/common';
import { CreateLegislationGroupDto } from './dto/create-legislation-group.dto';
import { UpdateLegislationGroupDto } from './dto/update-legislation-group.dto';
import { LegislationGroup } from './entities/legislation-group.entity';

@Injectable()
export class LegislationGroupService {
  constructor(
    @Inject('LEGISLATION_GROUP_REPOSITORY')
    private readonly legislationGroupRepository: typeof LegislationGroup,
  ) {}

  async create(createLegislationGroupDto: CreateLegislationGroupDto) {
    return await this.legislationGroupRepository.create(
      createLegislationGroupDto,
    );
  }

  findAll() {
    return `This action returns all legislationGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} legislationGroup`;
  }

  update(id: number, updateLegislationGroupDto: UpdateLegislationGroupDto) {
    return `This action updates a #${id} legislationGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} legislationGroup`;
  }
}
