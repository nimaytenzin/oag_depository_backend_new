import { PartialType } from '@nestjs/swagger';
import { CreateDelegatedLegislationDto } from './create-delegated-legislation.dto';

export class UpdateDelegatedLegislationDto extends PartialType(CreateDelegatedLegislationDto) {}
