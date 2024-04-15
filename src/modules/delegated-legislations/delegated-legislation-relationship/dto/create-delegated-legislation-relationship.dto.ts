import { DelegatedLegislationRelationshipActions } from 'src/constants/enums';

export class CreateDelegatedLegislationRelationshipDto {
  actingDelegatedLegislationId: number;
  action: DelegatedLegislationRelationshipActions;
  affectedDelegatedLegislationId: number;
}
