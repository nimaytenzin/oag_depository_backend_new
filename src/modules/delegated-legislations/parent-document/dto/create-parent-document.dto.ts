import { ParentDocumentType } from 'src/constants/enums';

export class CreateParentDocumentDto {
  type: ParentDocumentType;
  title_eng: string;
  title_dzo: string;
  date: string;
  delegatedLegislationId: number;
  fileUri: string;
}
