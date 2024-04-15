import { PartialType } from '@nestjs/swagger';
import { CreateStashLegislationDto } from './create-stash-legislation.dto';

export class UpdateStashLegislationDto extends PartialType(CreateStashLegislationDto) {}
