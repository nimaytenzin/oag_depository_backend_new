import { PartialType } from '@nestjs/swagger';
import { CreateStashSectionDto } from './create-stash-section.dto';

export class UpdateStashSectionDto extends PartialType(CreateStashSectionDto) {}
