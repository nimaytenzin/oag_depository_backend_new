import { ApiProperty } from '@nestjs/swagger';

export class SearchLegislationDto {
  @ApiProperty()
  keyword: string;
}
