import { Inject, Injectable } from '@nestjs/common';
import { CreateParentDocumentDto } from './dto/create-parent-document.dto';
import { UpdateParentDocumentDto } from './dto/update-parent-document.dto';
import { ParentDocument } from './entities/parent-document.entity';

@Injectable()
export class ParentDocumentService {
  constructor(
    @Inject('PARENT_DOCUMENT_REPOSITORY')
    private readonly repository: typeof ParentDocument,
  ) {}

  create(createParentDocumentDto: CreateParentDocumentDto) {
    return 'This action adds a new parentDocument';
  }

  findAll() {
    return `This action returns all parentDocument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parentDocument`;
  }

  update(id: number, updateParentDocumentDto: UpdateParentDocumentDto) {
    return `This action updates a #${id} parentDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} parentDocument`;
  }
}
