import { LanguageType } from 'src/constants/enums';

export interface CreateDocumentCopyDto {
  fileUri?: string;
  language: LanguageType;

  legislationId?: number;
  delegatedLegislationId?: number;
  amendmentId?: number;
}
