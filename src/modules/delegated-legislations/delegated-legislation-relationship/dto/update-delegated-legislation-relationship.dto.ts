import { PartialType } from '@nestjs/swagger';
import { CreateDelegatedLegislationRelationshipDto } from './create-delegated-legislation-relationship.dto';

export class UpdateDelegatedLegislationRelationshipDto extends PartialType(CreateDelegatedLegislationRelationshipDto) {}
