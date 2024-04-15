import { PartialType } from '@nestjs/swagger';
import { CreateParentDocumentDto } from './create-parent-document.dto';

export class UpdateParentDocumentDto extends PartialType(CreateParentDocumentDto) {}
