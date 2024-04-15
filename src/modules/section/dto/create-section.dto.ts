import { ApiProperty } from '@nestjs/swagger';

export interface CreateSectionDto {
  order: number;

  type: string;

  clause_eng: string;

  clause_dzo: string;

  legislationId?: number;

  delegatedLegislationId?: number;
  amendmentId?: number;
}

export class InsertSectionDto {
  topOrder: number;
  bottomOrder: number;
  type: string;
  clause_eng: string;
  clause_dzo: string;
  legislationId: number;
  delegatedLegislationId: number;
  amendmentId: number;
}
