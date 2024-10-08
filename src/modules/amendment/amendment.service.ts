import { Inject, Injectable } from '@nestjs/common';
import { CreateAmendmentDto } from './dto/create-amendment.dto';
import { UpdateAmendmentDto } from './dto/update-amendment.dto';
import { Amendment } from './entities/amendment.entity';
import { instanceToPlain } from 'class-transformer';
import { Change } from '../change/entities/change.entity';
import { ChangeValue } from '../change-value/entities/change-value.entity';
import { IgnoreAttributes, SectionChangeType } from 'src/constants/enums';
import { StashLegislationService } from '../stash-legislation/stash-legislation.service';
import { StashDelegatedLegislationService } from '../stash-delegated-legislation/stash-delegated-legislation.service';
import { StashSectionService } from '../stash-section/stash-section.service';
import { ChangeService } from '../change/change.service';
import { ChangeValueService } from '../change-value/change-value.service';
import { LegislationService } from '../legislations/legislation/legislation.service';
import { Model } from 'sequelize-typescript';
import { CreateChangeDto } from '../change/dto/create-change.dto';
import { CreateChangeValueDto } from '../change-value/dto/create-change-value.dto';
import { SectionService } from '../section/section.service';
import { DelegatedLegislationService } from '../delegated-legislations/delegated-legislation/delegated-legislation.service';
import UpdateSectionDto from '../section/dto/update-section.dto';
import { UpdateLegislationDto } from '../legislations/legislation/dto/update-legislation.dto';
import { CreateAmendmentSectionDto } from '../stash-section/dto/create-stash-section.dto';
import { InsertSectionDto } from '../section/dto/create-section.dto';
import { Section } from '../section/entities/section.entity';

@Injectable()
export class AmendmentService {
  constructor(
    @Inject('AMENDMENT_REPOSITORY')
    private readonly amendmentRepository: typeof Amendment,
    private readonly stashLegislationService: StashLegislationService,
    private readonly stashDelegatedLegislationService: StashDelegatedLegislationService,
    private readonly stashSectionService: StashSectionService,
    private readonly changeService: ChangeService,
    private readonly changeValueService: ChangeValueService,
    private readonly legislationService: LegislationService,
    private readonly delegatedLegislationService: DelegatedLegislationService,
    private readonly sectionService: SectionService,
  ) {}

  create(createAmendmentDto: CreateAmendmentDto) {
    return this.amendmentRepository.create(instanceToPlain(createAmendmentDto));
  }
  async findOne(id: number) {
    return await this.amendmentRepository.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Change,
          include: [{ model: ChangeValue }],
        },
      ],
    });
  }

  findOneWithIncludes(id: number) {
    return this.amendmentRepository.findOne({
      where: {
        id: id,
      },
      attributes: ['id'],
      include: [
        {
          model: Change,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: ChangeValue,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
    });
  }

  async findAllByLegislation(legislationId: number) {
    return await this.amendmentRepository.findAll({
      where: {
        legislationId: legislationId,
      },
      include: [{ model: Change, include: [{ model: ChangeValue }] }],
    });
  }

  async findAllByDelegatedLegislation(dLegislationId: number) {
    return await this.amendmentRepository.findAll({
      where: {
        delegatedLegislationId: dLegislationId,
      },
      include: [{ model: Change, include: [{ model: ChangeValue }] }],
    });
  }

  async moveStashDLegislationToDLegislation(
    dlegislationId: number,
  ): Promise<boolean> {
    const stashDLegislation =
      await this.stashDelegatedLegislationService.findOneByDelegatedLegislationId(
        dlegislationId,
      );
    if (stashDLegislation) {
      await this.delegatedLegislationService.update(
        dlegislationId,
        instanceToPlain(stashDLegislation),
      );
      await this.stashLegislationService.removeByLegislationId(dlegislationId);
    }
    return true;
  }

  async moveStashLegislationToLegislation(
    legislationId: number,
  ): Promise<boolean> {
    const stashLegislation =
      await this.stashLegislationService.findOneByLegislationId(legislationId);
    if (stashLegislation) {
      const updateObject: UpdateLegislationDto = {
        title_eng: stashLegislation.title_eng,
        title_dzo: stashLegislation.title_dzo,
        documentYear: stashLegislation.documentYear,
        status: stashLegislation.status,
        commencementDate: stashLegislation.commencementDate,
        amendmentDate: stashLegislation.amendmentDate,
        repealDate: stashLegislation.repealDate,
        isPublished: stashLegislation.isPublished,
        isActive: stashLegislation.isActive,
        type: stashLegislation.type,
        tabledDate: stashLegislation.tabledDate,
        enactmentDate: stashLegislation.enactmentDate,
      };
      await this.legislationService.update(
        legislationId,
        instanceToPlain(updateObject),
      );
      await this.stashLegislationService.removeByLegislationId(legislationId);
    }
    return true;
  }

  async moveStashSectionToSection(stashSectionId: number): Promise<boolean> {
    const stashSections = await this.stashSectionService.findByPK(
      stashSectionId,
    );
    if (stashSections) {
      const updateSectionObject: UpdateSectionDto = {
        order: stashSections.order,
        type: stashSections.type,
        clause_eng: stashSections.clause_eng,
        clause_dzo: stashSections.clause_dzo,
        legislationId: stashSections.legislationId,
        delegatedLegislationId: stashSections.delegatedLegislationId,
      };
      await this.sectionService.update(
        stashSections.sectionId,
        updateSectionObject,
      );
      await this.stashSectionService.remove(stashSectionId);
    }
    return true;
  }

  //AMENDMENT TRACKER

  async createChangeValue(
    fields: [string, string, string][],
    changeId: number,
  ) {
    console.log('\n\n', 'CREATING CHANG EVALYES', fields, changeId, '\n\n');
    for (let i = 0; i < fields.length; i++) {
      const changeValueDto: CreateChangeValueDto = {
        attribute: fields[i][0],
        oldValue: fields[i][1],
        newValue: fields[i][2],
        changeId: changeId,
      };

      await this.changeValueService.create(changeValueDto);
    }
  }

  async createChangeSection(
    createSectionDto: CreateAmendmentSectionDto,
  ): Promise<any> {
    console.log('\n\n\n NEW CHANGE SECTION', createSectionDto);
    let section, changedFieldsAttributes;
    const oldSection = await this.sectionService.findOne(
      createSectionDto.sectionId,
    );

    switch (createSectionDto.changeType) {
      case SectionChangeType.CREATION.toString():
        section = await this.createSection(createSectionDto);
        changedFieldsAttributes = await this.prepareChangeValueAttributes(
          oldSection,
          section,
          SectionChangeType.CREATION,
        );
        break;
      case SectionChangeType.INSERTION.toString():
        section = await this.insertSection(createSectionDto);
        changedFieldsAttributes = await this.prepareChangeValueAttributes(
          oldSection,
          section,
          SectionChangeType.CREATION,
        );
        break;
      case SectionChangeType.MODIFICATION.toString():
        section = await this.updateSection(createSectionDto);

        console.log(
          '\n\n MODIFICATION \n',
          'OLD=',
          oldSection,
          'NEW=',
          section,
        );

        changedFieldsAttributes = await this.prepareChangeValueAttributes(
          oldSection,
          section,
          SectionChangeType.MODIFICATION,
        );
        break;
      case SectionChangeType.DELETION.toString():
        section = await this.deleteSection(createSectionDto);
        changedFieldsAttributes = await this.prepareChangeValueAttributes(
          oldSection,
          section,
          SectionChangeType.DELETION,
        );
        break;
      default:
        throw new Error(
          `Unsupported changeType: ${createSectionDto.changeType}`,
        );
    }

    const changeDto = this.prepareChangeDto(createSectionDto, section);
    const createdChangeObject = await this.changeService.create(changeDto);
    console.log('\n\nCHANGE DTO \n\n', changeDto);
    console.log('\n\nCHANGEObject \n\n', createdChangeObject);
    console.log('\n\nCHANGEd fileds \n\n', changedFieldsAttributes);

    await this.createChangeValue(
      changedFieldsAttributes,
      createdChangeObject.id,
    );

    return true;
  }

  private async createSection(
    createSectionDto: CreateAmendmentSectionDto,
  ): Promise<any> {
    const createdSection = await this.sectionService.create({
      order: 0,
      type: createSectionDto.type,
      clause_eng: createSectionDto.clause_eng,
      clause_dzo: createSectionDto.clause_dzo,
      delegatedLegislationId: createSectionDto.delegatedLegislationId,
    });
    return createdSection;
  }

  private async insertSection(
    createSectionDto: CreateAmendmentSectionDto,
  ): Promise<any> {
    const insertData: InsertSectionDto = {
      topOrder: createSectionDto.topOrder,
      bottomOrder: createSectionDto.bottomOrder,
      type: createSectionDto.type,
      clause_eng: createSectionDto.clause_eng,
      clause_dzo: createSectionDto.clause_dzo,
      legislationId: createSectionDto.legislationId,
      delegatedLegislationId: createSectionDto.delegatedLegislationId,
      amendmentId: createSectionDto.amendmentId,
    };
    const insertedSection = await this.sectionService.insertInBetween(
      insertData,
    );
    return insertedSection;
  }

  private async updateSection(
    createSectionDto: CreateAmendmentSectionDto,
  ): Promise<Section> {
    const update = await this.sectionService.update(
      createSectionDto.sectionId,
      {
        clause_eng: createSectionDto.clause_eng,
        clause_dzo: createSectionDto.clause_dzo,
        order: createSectionDto.order,
        type: createSectionDto.type,
        amendentId: createSectionDto.amendmentId,
      },
    );
    const updatedSection = await this.sectionService.findOne(
      createSectionDto.sectionId,
    );
    return updatedSection;
  }

  private async deleteSection(
    createSectionDto: CreateAmendmentSectionDto,
  ): Promise<any> {
    const update = await this.sectionService.update(
      createSectionDto.sectionId,
      {
        softDelete: 1,
      },
    );
    const deletedSection = await this.sectionService.findOne(
      createSectionDto.sectionId,
    );

    return deletedSection;
  }

  private prepareChangeDto(
    createSectionDto: CreateAmendmentSectionDto,
    section: any,
  ): CreateChangeDto {
    const changeDto: CreateChangeDto = {
      sectionId: section.id,
      amendmentId: createSectionDto.amendmentId,
      changeType: createSectionDto.changeType,
    };

    if (createSectionDto.legislationId) {
      changeDto.legislationId = createSectionDto.legislationId;
    } else {
      changeDto.delegatedLegislationId =
        createSectionDto.delegatedLegislationId;
    }

    return changeDto;
  }

  prepareChangeValueAttributes(
    oldSection: Model<any>,
    newSection: any,
    type = SectionChangeType.MODIFICATION,
  ): [string, string, string][] {
    const ignored = IgnoreAttributes;
    const attributes = Object.keys(oldSection.get()); // Use oldSection instead of entity
    const fields = attributes.filter((element, index, array) => {
      if (ignored.includes(element)) {
        return false;
      }
      return true;
    });

    const changeTuples: [string, string, string][] = []; // Renamed from legislationFieldTuple to changeTuples
    for (let i = 0; i < fields.length; i++) {
      if (
        oldSection[fields[i]] !== null && // Use oldSection instead of entity
        newSection[fields[i]] !== null && // Use newSection instead of stashEntity
        type == SectionChangeType.MODIFICATION
      ) {
        if (oldSection[fields[i]] !== newSection[fields[i]]) {
          // Use oldSection and newSection
          changeTuples.push([
            fields[i],
            oldSection[fields[i]], // Use oldSection
            newSection[fields[i]], // Use newSection
          ]);
        }
      } else if (type == SectionChangeType.CREATION) {
        changeTuples.push([fields[i], null, oldSection[fields[i]]]); // Use oldSection
      } else if (type == SectionChangeType.DELETION) {
        changeTuples.push([fields[i], oldSection[fields[i]], null]); // Use oldSection
      }
    }
    return changeTuples.length > 0 ? changeTuples : null;
  }
}
