import { PartialType } from '@nestjs/swagger';
import { CreateStashDelegatedLegislationDto } from './create-stash-delegated-legislation.dto';

export class UpdateStashDelegatedLegislationDto extends PartialType(CreateStashDelegatedLegislationDto) {}
