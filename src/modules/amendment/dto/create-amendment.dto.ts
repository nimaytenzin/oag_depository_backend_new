import { ApiProperty } from '@nestjs/swagger';
import { LegislationStatus } from 'src/constants/enums';

export class CreateAmendmentDto {
  legislationId?: number;

  delegatedLegislationId?: number;

  title_eng: string;

  title_dzo: string;

  documentYear: number;

  status: LegislationStatus;

  isPublished: boolean;

  isActive: boolean;

  enactmentDates: string;

  commencementDate: string;

  repealDate: string;

  userId: number;
}
