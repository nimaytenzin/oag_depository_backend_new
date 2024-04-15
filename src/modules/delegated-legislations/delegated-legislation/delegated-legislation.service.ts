import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDelegatedLegislationDto } from './dto/create-delegated-legislation.dto';
import { DelegatedLegislation } from './entities/delegated-legislation.entity';
import { instanceToPlain } from 'class-transformer';

import {
  DelegatedLegislationType,
  LegislationStatus,
  DelegatedLegislationStatus,
} from 'src/constants/enums';
import { PaginatedResult } from 'src/utilities/pagination';
import { SectionService } from 'src/modules/section/section.service';
import { Legislation } from 'src/modules/legislations/legislation/entities/legislation.entity';
import { UpdateDelegatedLegislationDto } from './dto/update-delegated-legislation.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { DelegatedLegislationGroupService } from '../delegated-legislation-group/delegated-legislation-group.service';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';
import { Op } from 'sequelize';

@Injectable()
export class DelegatedLegislationService {
  constructor(
    @Inject('DELEGATED_LEGISLATION_REPOSITORY')
    private readonly delegatedLegislationRepository: typeof DelegatedLegislation,
    private readonly sectionService: SectionService,
    private readonly delegatedlegislationGroupService: DelegatedLegislationGroupService,
  ) {}

  async create(createLegislationDto) {
    const dlGroup = await this.delegatedlegislationGroupService.create({
      name: createLegislationDto.title_eng,
    });
    return this.delegatedLegislationRepository.create({
      ...createLegislationDto,
      delegatedLegislationGroupId: dlGroup.id,
    });
  }

  async createLegislationInExsitingLegislationGroup(createLegislationDto) {
    return this.delegatedLegislationRepository.create(createLegislationDto);
  }
  async findAll() {
    return await this.delegatedLegislationRepository.findAll();
  }
  async findEnactedDelegatedLegislatoin(number: number) {
    return await this.delegatedLegislationRepository.findAll({
      where: {
        status: LegislationStatus.ENACTED,
      },
      order: [['createdAt', 'DESC']],
      limit: number,
    });
  }
  async findAllByGroupSortedByYear(dlId: number) {
    const delegatedLegislation = await this.findOne(dlId);
    return await this.delegatedLegislationRepository.findAll({
      where: {
        delegatedLegislationGroupId:
          delegatedLegislation.delegatedLegislationGroupId,
      },
      include: [
        {
          model: Amendment,
        },
        {
          model: Legislation,
        },
      ],
      order: [['documentYear', 'DESC']],
    });
  }
  async remove(id: number) {
    return await this.delegatedLegislationRepository.destroy({
      where: {
        id: id,
      },
    });
  }
  async findByPk(id: number) {
    return await this.delegatedLegislationRepository.findByPk(id);
  }

  async findOne(id: number) {
    return await this.delegatedLegislationRepository.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Legislation,
        },
      ],
    });
  }

  async findGuidelinesPaginated(
    pageno: number,
  ): Promise<PaginatedResult<DelegatedLegislation>> {
    const [data, total] = await Promise.all([
      this.delegatedLegislationRepository.findAll({
        where: {
          type: DelegatedLegislationType.GUIDELINES,
          status: LegislationStatus.ENACTED,
        },
      }),

      this.delegatedLegislationRepository.count({
        where: {
          type: DelegatedLegislationType.GUIDELINES,
          status: LegislationStatus.ENACTED,
        },
      }),
    ]);
    const limit = 9;
    const totalPages = Math.ceil(total / limit);
    const lastPage = Math.ceil(totalPages / limit) - 1;
    const previousPage: number = pageno - 1 === -1 ? null : pageno - 1;
    const nextPage = pageno + 1 > lastPage ? null : pageno + 1;
    return {
      data: data,
      firstPage: 0,
      currentPage: pageno,
      previousPage: previousPage,
      nextPage: nextPage,
      lastPage: lastPage,
      pageSize: limit,
      totalPages: totalPages,
      count: total,
    };
  }

  async findAllByParentLegislation(parentLegislationId) {
    return await this.delegatedLegislationRepository.findAll({
      where: {
        legislationId: parentLegislationId,
      },
    });
  }

  async findRulesPaginated(
    pageno: number,
  ): Promise<PaginatedResult<DelegatedLegislation>> {
    const limit = 9;

    const [data, total] = await Promise.all([
      this.delegatedLegislationRepository.findAll({
        where: {
          status: LegislationStatus.ENACTED,
        },
        include: [{ model: Legislation }],
        offset: pageno * limit,
        limit,
      }),

      this.delegatedLegislationRepository.count({
        where: {
          type: DelegatedLegislationType.RULESANDREGULATION,
          status: LegislationStatus.ENACTED,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const lastPage = totalPages - 1;
    const previousPage = pageno - 1 < 0 ? null : pageno - 1;
    const nextPage = pageno + 1 > lastPage ? null : pageno + 1;

    return {
      data,
      firstPage: 0,
      currentPage: pageno,
      previousPage,
      nextPage,
      lastPage,
      pageSize: limit,
      totalPages,
      count: total,
    };
  }

  async findRepealedDlPaginated(
    pageno: number,
  ): Promise<PaginatedResult<DelegatedLegislation>> {
    const limit = 9;

    const [data, total] = await Promise.all([
      this.delegatedLegislationRepository.findAll({
        where: {
          status: LegislationStatus.REPEALED,
        },
        include: [{ model: Legislation }],
        offset: pageno * limit,
        limit,
      }),

      this.delegatedLegislationRepository.count({
        where: {
          status: LegislationStatus.REPEALED,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const lastPage = totalPages - 1;
    const previousPage = pageno - 1 < 0 ? null : pageno - 1;
    const nextPage = pageno + 1 > lastPage ? null : pageno + 1;

    return {
      data,
      firstPage: 0,
      currentPage: pageno,
      previousPage,
      nextPage,
      lastPage,
      pageSize: limit,
      totalPages,
      count: total,
    };
  }

  async findAllDraftByType(type: string) {
    if (type) {
      return await this.delegatedLegislationRepository.findAll({
        where: {
          isPublished: false,
          type: type,
        },
        include: [
          { model: User, attributes: ['fullName', 'email'] },
          { model: Legislation },
        ],
      });
    } else {
      return await this.delegatedLegislationRepository.findAll({
        where: {
          isPublished: false,
        },
        include: [
          { model: User, attributes: ['fullName', 'email'] },
          { model: Legislation },
        ],
      });
    }
  }

  async update(
    id: number,
    updateObject: UpdateDelegatedLegislationDto,
  ): Promise<DelegatedLegislation> {
    const delegatedLegislation =
      await this.delegatedLegislationRepository.findByPk(id);
    if (!delegatedLegislation) {
      throw new HttpException(
        'Delegated Legislation not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await delegatedLegislation.update(instanceToPlain(updateObject));
    return delegatedLegislation;
  }

  //  ************************************ PUBLIC ROUTES ******************************** //

  async publicFindOne(id: number) {
    return await this.delegatedLegislationRepository.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Legislation,
        },
      ],
    });
  }

  async publicFindCurrentDelegatedLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<DelegatedLegislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      status: DelegatedLegislationStatus.ENACTED,
      isPublished: true,
      isActive: true,
    };

    if (startingCharacter) {
      whereClause.title_eng = {
        [Op.startsWith]: startingCharacter,
      };
    }

    if (effectiveYear) {
      whereClause.documentYear = effectiveYear;
    }

    const result = await this.delegatedLegislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      include: [{ model: Legislation }],
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
        'legislationId',
        'commencementDate',
        'repealDate',
        'tabledDate',
      ],
    });

    const total = result.count;
    const data = result.rows;
    const totalPages = Math.ceil(total / limit);
    const lastPage = totalPages - 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    const nextPage = page + 1 > lastPage + 1 ? null : page + 1;

    return {
      data: data,
      firstPage: 1,
      currentPage: page,
      previousPage: previousPage,
      nextPage: nextPage,
      lastPage: lastPage + 1,
      pageSize: limit,
      totalPages: totalPages,
      count: total,
    };
  }

  async publicFindModifiedDelegatedLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<DelegatedLegislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      status: DelegatedLegislationStatus.MODIFIED,
      isPublished: true,
      isActive: true,
    };

    if (startingCharacter) {
      whereClause.title_eng = {
        [Op.startsWith]: startingCharacter,
      };
    }

    if (effectiveYear) {
      whereClause.documentYear = effectiveYear;
    }

    const result = await this.delegatedLegislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      include: [{ model: Legislation }],
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
        'legislationId',
        'commencementDate',
        'repealDate',
        'tabledDate',
      ],
    });

    const total = result.count;
    const data = result.rows;
    const totalPages = Math.ceil(total / limit);
    const lastPage = totalPages - 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    const nextPage = page + 1 > lastPage + 1 ? null : page + 1;

    return {
      data: data,
      firstPage: 1,
      currentPage: page,
      previousPage: previousPage,
      nextPage: nextPage,
      lastPage: lastPage + 1,
      pageSize: limit,
      totalPages: totalPages,
      count: total,
    };
  }
  async publicFindRevokedDelegatedLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<DelegatedLegislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      status: DelegatedLegislationStatus.REVOKED,
      isPublished: true,
      isActive: true,
    };

    if (startingCharacter) {
      whereClause.title_eng = {
        [Op.startsWith]: startingCharacter,
      };
    }

    if (effectiveYear) {
      whereClause.documentYear = effectiveYear;
    }

    const result = await this.delegatedLegislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      include: [{ model: Legislation }],
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
        'legislationId',
        'commencementDate',
        'repealDate',
        'tabledDate',
      ],
    });

    const total = result.count;
    const data = result.rows;
    const totalPages = Math.ceil(total / limit);
    const lastPage = totalPages - 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    const nextPage = page + 1 > lastPage + 1 ? null : page + 1;

    return {
      data: data,
      firstPage: 1,
      currentPage: page,
      previousPage: previousPage,
      nextPage: nextPage,
      lastPage: lastPage + 1,
      pageSize: limit,
      totalPages: totalPages,
      count: total,
    };
  }
}
