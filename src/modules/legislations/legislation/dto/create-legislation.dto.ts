export interface CreateLegislationDto {
  title_eng: string;
  title_dzo: string;
  type: string;
  status: string;
  isPublished: boolean;
  isActive: boolean;
  tabledDate?: string;
  enactmentDate?: string;
  amendmentDate?: string;
  repealDate?: string;
  documentYear: string;
}
