export class CreateStashLegislationDto {
  title_eng: string;
  title_dzo: string;

  status: string;
  type: string;
  isPublished: boolean;
  isActive: boolean;

  tabledDate?: string;
  enactmentDate?: string;
  amendmentDate?: string;
  repealDate?: string;

  documentYear: string;
  legislationId: number;
}
