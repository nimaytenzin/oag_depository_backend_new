import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAnnexureDto } from './dto/create-annexure.dto';
import { UpdateAnnexureDto } from './dto/update-annexure.dto';
import { Annexure } from './entities/annexure.entity';
import { DocumentStatus, DocumentType } from 'src/constants/enums';
import { doc } from 'prettier';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AnnexureService {
  constructor(
    @Inject('ANNEXURE_REPOSITORY')
    private readonly annexureRepository: typeof Annexure,
  ) {}

  async create(createAnnexureDto: CreateAnnexureDto) {
    console.log('\nnow in service');
    console.log(createAnnexureDto);
    return await this.annexureRepository.create(createAnnexureDto);
  }

  findAll() {
    return `This action returns all annexure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} annexure`;
  }

  async update(id: number, updateAnnexureDto) {
    const annexure = await this.annexureRepository.findByPk(id);
    if (!annexure) {
      throw new HttpException(
        'Update section failed. Not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    await annexure.update(instanceToPlain(updateAnnexureDto));
    return annexure;
  }

  async remove(id: number) {
    return await this.annexureRepository.destroy({
      where: {
        id,
      },
    });
  }

  async findAllByDraftLegislation(documentRefId: number) {
    console.log('\n  \n');
    console.log(documentRefId);
    return await this.annexureRepository.findAll({
      where: {
        legislationType: DocumentType.LEGISLATION,
        refId: documentRefId,
      },
    });
  }

  async findByLegislation(documentRefId: number, type: string) {
    return await this.annexureRepository.findAll({
      where: {
        legislationType: DocumentType.LEGISLATION,
        refId: documentRefId,
        annexureType: type,
      },
    });
  }

  async findByDelegatedLegislation(documentRefId: number, type: string) {
    return await this.annexureRepository.findAll({
      where: {
        legislationType: DocumentType.DELEGATED_LEGISLATION,
        refId: documentRefId,
        annexureType: type,
      },
    });
  }

  async findAllByDelegatedLegislation(documentRefId: number) {
    return await this.annexureRepository.findAll({
      where: {
        legislationType: DocumentType.DELEGATED_LEGISLATION,
        refId: documentRefId,
      },
    });
  }
}
