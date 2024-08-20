import { Inject, Injectable } from '@nestjs/common';
import { CreateDelegatedLegislationRelationshipDto } from './dto/create-delegated-legislation-relationship.dto';
import { UpdateDelegatedLegislationRelationshipDto } from './dto/update-delegated-legislation-relationship.dto';
import { DelegatedLegislationRelationship } from './entities/delegated-legislation-relationship.entity';
import { DelegatedLegislationRelationshipActions } from 'src/constants/enums';

@Injectable()
export class DelegatedLegislationRelationshipService {
  constructor(
    @Inject('DELEGATED_LEGISLATION_RELATIONSHIP_REPOSITORY')
    private readonly repository: typeof DelegatedLegislationRelationship,
  ) {}
  create(
    createDelegatedLegislationRelationshipDto: CreateDelegatedLegislationRelationshipDto,
  ) {
    return 'This action adds a new delegatedLegislationRelationship';
  }

  findAll() {
    return `This action returns all delegatedLegislationRelationship`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delegatedLegislationRelationship`;
  }

  update(
    id: number,
    updateDelegatedLegislationRelationshipDto: UpdateDelegatedLegislationRelationshipDto,
  ) {
    return `This action updates a #${id} delegatedLegislationRelationship`;
  }

  remove(id: number) {
    return `This action removes a #${id} delegatedLegislationRelationship`;
  }

  async findAllRevokedByDelegatedLegisaltion(legislationId: number) {
    return await this.repository.findAll({
      where: {
        actingDelegatedLegislationId: legislationId,
        action: DelegatedLegislationRelationshipActions.REVOKES,
      },
    });
  }
  async findAllRevokingDelegatedLegislation(legislationId: number) {
    return await this.repository.findAll({
      where: {
        affectedDelegatedLegislationId: legislationId,
        action: DelegatedLegislationRelationshipActions.REVOKES,
      },
    });
  }
}
