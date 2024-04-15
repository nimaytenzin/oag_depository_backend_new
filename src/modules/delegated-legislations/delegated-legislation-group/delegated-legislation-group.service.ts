import { Inject, Injectable } from '@nestjs/common';
import { CreateDelegatedLegislationGroupDto } from './dto/create-delegated-legislation-group.dto';
import { UpdateDelegatedLegislationGroupDto } from './dto/update-delegated-legislation-group.dto';
import { DelegatedLegislationGroup } from './entities/delegated-legislation-group.entity';
import { DelegatedLegislation } from '../delegated-legislation/entities/delegated-legislation.entity';

@Injectable()
export class DelegatedLegislationGroupService {
  constructor(
    @Inject('DELEGATED_LEGISLATION_GROUP_REPOSITORY')
    private readonly delegatedLegislationGroupRepository: typeof DelegatedLegislationGroup,
  ) {}

  async create(
    createDelegatedLegislationGroupDto: CreateDelegatedLegislationGroupDto,
  ) {
    return await this.delegatedLegislationGroupRepository.create(
      createDelegatedLegislationGroupDto,
    );
  }

  async findAll() {
    return await this.delegatedLegislationGroupRepository.findAll({
      include: [{ model: DelegatedLegislation }],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} delegatedLegislationGroup`;
  }

  update(
    id: number,
    updateDelegatedLegislationGroupDto: UpdateDelegatedLegislationGroupDto,
  ) {
    return `This action updates a #${id} delegatedLegislationGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} delegatedLegislationGroup`;
  }
}
