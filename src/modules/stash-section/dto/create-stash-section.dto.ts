import { ApiProperty } from '@nestjs/swagger';

export class CreateStashSectionDto {
  @ApiProperty()
  order: number;
  @ApiProperty()
  type: string;
  @ApiProperty()
  clause_eng: string;
  @ApiProperty()
  clause_dzo: string;
  @ApiProperty()
  sectionId: string;
  @ApiProperty()
  changeType: string;
  @ApiProperty()
  legislationId: number;
  @ApiProperty()
  delegatedLegislationId: number;
}

export class CreateAmendmentSectionDto {
  order?: number;
  bottomOrder?: number;
  topOrder?: number;
  type: string;
  clause_eng: string;
  clause_dzo: string;
  sectionId?: number;
  changeType: string;
  amendmentId: number;
  legislationId?: number;
  delegatedLegislationId?: number;
}
