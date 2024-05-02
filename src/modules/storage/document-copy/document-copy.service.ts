import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentCopyDto } from './dto/create-document-copy.dto';
import { UpdateDocumentCopyDto } from './dto/update-document-copy.dto';
import { DocumentCopy } from './entities/document-copy.entity';
import { DocumentStatus, DocumentType } from 'src/constants/enums';
import { instanceToPlain } from 'class-transformer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentCopyService {
  constructor(
    @Inject('DOCUMENT_COPY_REPOSITORY')
    private readonly documentCopyRepository: typeof DocumentCopy,
  ) {}
  async create(createDocumentCopyDto: CreateDocumentCopyDto) {
    console.log('\n\ncreating new docuiment copy \n\n', createDocumentCopyDto);
    const ok = await this.documentCopyRepository.create(
      instanceToPlain(createDocumentCopyDto),
    );
    console.log(ok);
    return ok;
  }

  findAll() {
    return `This action returns all documentCopy`;
  }

  async findAllByDraftLegislation(documentRefId: number) {
    return await this.documentCopyRepository.findAll({
      where: {
        legislationId: documentRefId,
      },
    });
  }

  async findAllByLegislation(documentRefId: number) {
    return await this.documentCopyRepository.findAll({
      where: {
        legislationId: documentRefId,
      },
    });
  }

  async findAllByDraftDelegatedLegislation(documentRefId: number) {
    return await this.documentCopyRepository.findAll({
      where: {
        delegatedLegislationId: documentRefId,
      },
    });
  }

  async findAllByDelegatedLegislation(documentRefId: number) {
    return await this.documentCopyRepository.findAll({
      where: {
        delegatedLegislationId: documentRefId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} documentCopy`;
  }

  async update(id: number, updateDocumentCopyDto: UpdateDocumentCopyDto) {
    const documentcopy = await this.documentCopyRepository.findByPk(id);
    if (!documentcopy) {
      throw new Error(` Document copy with ${id} not found`);
    }
    await documentcopy.update(instanceToPlain(updateDocumentCopyDto));
    return documentcopy;
  }

  async findDraftsByLegislation(documentRefId: number) {
    return await this.documentCopyRepository.findAll({
      where: {
        legislationId: documentRefId,
      },
    });
  }

  async remove(id: number) {
    const documentCopy = await this.documentCopyRepository.findByPk(id);
    if (!documentCopy) {
      throw new Error(`Document copy with ${id} not found`);
    }

    const projectRoot = path.resolve(__dirname, '../../../../');
    const filePath = path.join(projectRoot, '', documentCopy.fileUri);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const deletedRow = await this.documentCopyRepository.destroy({
      where: { id },
    });

    return deletedRow > 0;
  }
}
