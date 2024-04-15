import { PartialType } from '@nestjs/swagger';
import { CreateChangeValueDto } from './create-change-value.dto';

export class UpdateChangeValueDto extends PartialType(CreateChangeValueDto) {}
