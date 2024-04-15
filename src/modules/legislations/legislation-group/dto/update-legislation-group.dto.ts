import { CreateLegislationGroupDto } from './create-legislation-group.dto';

export interface UpdateLegislationGroupDto extends CreateLegislationGroupDto {
  id: number;
}
