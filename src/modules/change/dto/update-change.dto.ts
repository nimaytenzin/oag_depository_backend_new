import { PartialType } from '@nestjs/swagger';
import { CreateChangeDto } from './create-change.dto';

export class UpdateChangeDto extends PartialType(CreateChangeDto) {}
