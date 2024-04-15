import { LegislationRelationshipActions } from 'src/constants/enums';

export class CreateLegislationRelationshipDto {
  actingLegislationId: number;

  action: LegislationRelationshipActions;

  affectedLegislationId: number;
}
