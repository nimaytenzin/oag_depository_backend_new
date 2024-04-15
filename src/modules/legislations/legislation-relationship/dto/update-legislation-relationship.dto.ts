import { PartialType } from '@nestjs/swagger';
import { CreateLegislationRelationshipDto } from './create-legislation-relationship.dto';

export class UpdateLegislationRelationshipDto extends PartialType(CreateLegislationRelationshipDto) {}
