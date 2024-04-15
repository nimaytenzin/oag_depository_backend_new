import { PartialType } from '@nestjs/swagger';
import { CreateViewCountDto } from './create-view-count.dto';

export class UpdateViewCountDto extends PartialType(CreateViewCountDto) {}
