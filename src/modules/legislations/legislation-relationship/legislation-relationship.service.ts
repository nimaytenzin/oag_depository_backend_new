import { Inject, Injectable } from '@nestjs/common';
import { CreateLegislationRelationshipDto } from './dto/create-legislation-relationship.dto';
import { UpdateLegislationRelationshipDto } from './dto/update-legislation-relationship.dto';
import { LegislationRelationship } from './entities/legislation-relationship.entity';
import { Legislation } from '../legislation/entities/legislation.entity';
import { LegislationRelationshipActions } from 'src/constants/enums';

@Injectable()
export class LegislationRelationshipService {
  constructor(
    @Inject('LEGISLATION_RELATIONSHIP_REPOSITORY')
    private readonly repository: typeof LegislationRelationship,
  ) {}

  async create(
    createLegislationRelationshipDto: CreateLegislationRelationshipDto,
  ) {
    return await this.repository.create(createLegislationRelationshipDto);
  }

  async findAll() {
    return await this.repository.findAll({
      include: [
        { model: Legislation, as: 'actingLegislation' },
        { model: Legislation, as: 'affectedLegislation' },
      ],
    });
  }
  async findAllReapealedByLegisaltion(legislationId: number) {
    return await this.repository.findAll({
      where: {
        actingLegislationId: legislationId,
        action: LegislationRelationshipActions.REPEALS,
      },
    });
  }
  async findAllRepealingLegislation(legislationId: number) {
    return await this.repository.findAll({
      where: {
        affectedLegislationId: legislationId,
        action: LegislationRelationshipActions.REPEALS,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} legislationRelationship`;
  }

  update(
    id: number,
    updateLegislationRelationshipDto: UpdateLegislationRelationshipDto,
  ) {
    return `This action updates a #${id} legislationRelationship`;
  }

  remove(id: number) {
    return `This action removes a #${id} legislationRelationship`;
  }
}
