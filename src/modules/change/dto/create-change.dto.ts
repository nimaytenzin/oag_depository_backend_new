import { SectionChangeType } from 'src/constants/enums';

export class CreateChangeDto {
  sectionId: number;
  legislationId?: number;
  delegatedLegislationId?: number;
  amendmentId: number;
  changeType: string;
}
