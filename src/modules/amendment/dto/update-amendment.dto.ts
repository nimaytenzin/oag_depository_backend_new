import { PartialType } from '@nestjs/swagger';
import { CreateAmendmentDto } from './create-amendment.dto';

export class UpdateAmendmentDto extends PartialType(CreateAmendmentDto) {}
