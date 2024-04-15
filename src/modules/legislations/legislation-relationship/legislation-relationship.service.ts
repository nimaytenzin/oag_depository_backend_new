import { Inject, Injectable } from '@nestjs/common';
import { CreateLegislationRelationshipDto } from './dto/create-legislation-relationship.dto';
import { UpdateLegislationRelationshipDto } from './dto/update-legislation-relationship.dto';
import { LegislationRelationship } from './entities/legislation-relationship.entity';

@Injectable()
export class LegislationRelationshipService {
  constructor(
    @Inject('LEGISLATION_RELATIONSHIP_REPOSITORY')
    private readonly repository: typeof LegislationRelationship,
  ) {}

  create(createLegislationRelationshipDto: CreateLegislationRelationshipDto) {
    return 'This action adds a new legislationRelationship';
  }

  findAll() {
    return `This action returns all legislationRelationship`;
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
