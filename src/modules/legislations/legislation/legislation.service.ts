import { LegislationStatus } from '../../../constants/enums';
import { PaginatedResult } from '../../../utilities/pagination';
import { instanceToPlain } from 'class-transformer';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { SectionService } from '../../section/section.service';
import { UpdateLegislationDto } from './dto/update-legislation.dto';
import { Legislation } from './entities/legislation.entity';
import { LegislationType } from 'src/constants/enums';
import { AnnexureService } from 'src/modules/storage/annexure/annexure.service';
import { DocumentCopyService } from 'src/modules/storage/document-copy/document-copy.service';
import { User } from 'src/modules/users/entities/user.entity';
import { LegislationGroupService } from '../legislation-group/legislation-group.service';
import { Amendment } from 'src/modules/amendment/entities/amendment.entity';

@Injectable()
export class LegislationService {
  constructor(
    @Inject('LEGISLATION_REPOSITORY')
    private readonly legislationRepository: typeof Legislation,
    private readonly sectionService: SectionService,
    private readonly annexureService: AnnexureService,
    private readonly documentCopyService: DocumentCopyService,
    private readonly legislationGroupService: LegislationGroupService,
  ) {}

  async create(createLegislationDto) {
    const legislationGroup = await this.legislationGroupService.create({
      name: createLegislationDto.title_eng,
    });
    return this.legislationRepository.create({
      ...createLegislationDto,
      legislationGroupId: legislationGroup.id,
    });
  }

  async createLegislationInExsitingLegislationGroup(createLegislationDto) {
    return this.legislationRepository.create(createLegislationDto);
  }

  async update(
    id: number,
    updateObject: UpdateLegislationDto,
  ): Promise<Legislation> {
    const legislation = await this.legislationRepository.findByPk(id);

    if (!legislation) {
      throw new HttpException(
        'Update legislation failed. Not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await legislation.update(instanceToPlain(updateObject));
    return legislation;
  }

  async getAllLegislation() {
    return this.legislationRepository.findAll();
  }

  async findAllByGroupSortedByYear(groupId) {
    return await this.legislationRepository.findAll({
      where: {
        legislationGroupId: groupId,
      },
      include: [
        {
          model: Amendment,
        },
      ],
      order: [['documentYear', 'DESC']],
    });
  }
  async findLegislativeHistoryByLegislation(legislationId: number) {
    const legislation = await this.findOne(legislationId);
    return await this.legislationRepository.findAll({
      where: {
        legislationGroupId: legislation.legislationGroupId,
      },
      include: [
        {
          model: Amendment,
        },
      ],
      order: [['documentYear', 'DESC']],
    });
  }
  async findAllDraftActs() {
    return await this.legislationRepository.findAll({
      where: {
        isPublished: false,
        type: LegislationType.ACT,
        isActive: 1,
      },
      include: [{ model: User, attributes: ['fullName', 'email'] }],
    });
  }

  async findAllDraftByType(type: string) {
    if (type === LegislationType.ACT) {
      return await this.legislationRepository.findAll({
        where: {
          isPublished: false,
          type: LegislationType.ACT,
        },
        include: [{ model: User, attributes: ['fullName', 'email'] }],
      });
    } else if (type === LegislationType.CONVENTION) {
      return await this.legislationRepository.findAll({
        where: {
          isPublished: false,
          type: LegislationType.CONVENTION,
        },
        include: [{ model: User, attributes: ['fullName', 'email'] }],
      });
    } else if (type === LegislationStatus.BILL) {
      return await this.legislationRepository.findAll({
        where: {
          isPublished: false,
          status: LegislationStatus.BILL,
        },
        include: [{ model: User, attributes: ['fullName', 'email'] }],
      });
    } else if (type === LegislationStatus.REPEALED) {
      return await this.legislationRepository.findAll({
        where: {
          isPublished: false,
          status: LegislationStatus.REPEALED,
          type: LegislationType.CONVENTION,
        },
        include: [{ model: User, attributes: ['fullName', 'email'] }],
      });
    }
    return await this.legislationRepository.findAll({
      where: {
        isPublished: false,
      },
      include: [{ model: User, attributes: ['fullName', 'email'] }],
    });
  }

  findAll() {
    return this.legislationRepository.findAll({
      limit: 9,
    });
  }
  async getLegislationsPaginated(
    pageno: number,
  ): Promise<PaginatedResult<Legislation>> {
    const [data, total] = await Promise.all([
      this.legislationRepository.findAll({
        where: { type: LegislationType.ACT, status: LegislationStatus.ENACTED },
      }),

      this.legislationRepository.count({
        where: { type: LegislationType.ACT, status: LegislationStatus.ENACTED },
      }),
    ]);

    const limit = 9;
    const totalPages = Math.ceil(total / limit);
    const lastPage = Math.ceil(totalPages / limit) - 1;
    const previousPage: number = pageno - 1 === -1 ? null : pageno - 1;
    const nextPage = pageno + 1 > lastPage ? null : pageno + 1;
    return {
      data: data,
      firstPage: 1,
      currentPage: pageno,
      previousPage: previousPage,
      nextPage: nextPage,
      lastPage: lastPage,
      pageSize: limit,
      totalPages: totalPages,
      count: total,
    };
  }

  async findCurrentLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.ACT,
      status: LegislationStatus.ENACTED,
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

    console.log('\n\n', whereClause, '\n');
    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      include: [{ model: User }],
      limit: limit,
      offset: offset,
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
  async findRepealedLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.ACT,
      status: LegislationStatus.REPEALED,
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

    console.log('\n\n', whereClause, '\n');
    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      include: [{ model: User }],
      limit: limit,
      offset: offset,
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
  async findBilledLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.ACT,
      status: LegislationStatus.BILL,
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

    console.log('\n\n', whereClause, '\n');
    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      include: [{ model: User }],
      limit: limit,
      offset: offset,
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

  async findAllConventionsPaginated(
    pageno: number,
  ): Promise<PaginatedResult<Legislation>> {
    const [data, total] = await Promise.all([
      this.legislationRepository.findAll({
        where: { type: LegislationType.CONVENTION },
      }),

      this.legislationRepository.count({
        where: { type: LegislationType.CONVENTION },
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

  async findAllBillsPaginated(
    pageno: number,
  ): Promise<PaginatedResult<Legislation>> {
    const [data, total] = await Promise.all([
      this.legislationRepository.findAll({
        where: {
          type: LegislationType.ACT,
          status: LegislationStatus.BILL,
          isPublished: true,
          isActive: true,
        },
      }),

      this.legislationRepository.count({
        where: { type: LegislationType.ACT, status: LegislationStatus.BILL },
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

  async searchLegislation(keyword: string) {
    const searchTerm = `%${keyword}%`;
    return await this.legislationRepository.findAll({
      where: {
        title_eng: {
          [Op.like]: searchTerm,
        },
      },
    });
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
    startingCharacter: string,
    effectiveYear: number,
  ) {
    console.log(page, pageSize, startingCharacter, effectiveYear);

    const offset = (page - 1) * pageSize;

    const whereClause: any = {};

    if (startingCharacter) {
      whereClause.title_eng = {
        [Op.startsWith]: startingCharacter,
      };
    }

    if (effectiveYear) {
      whereClause.documentYear = effectiveYear;
    }

    return await this.legislationRepository.findAll({
      where: whereClause,
      limit: pageSize,
      offset,
    });
  }

  async findOne(id: number): Promise<Legislation> {
    const legislation = await this.legislationRepository.findOne({
      where: {
        id: id,
      },
    });
    return legislation;
  }

  async findEnactedLegislatoin(number: number): Promise<Legislation[]> {
    return await this.legislationRepository.findAll({
      where: {
        type: LegislationType.ACT,
        status: LegislationStatus.ENACTED,
      },
      order: [['createdAt', 'DESC']],
      limit: number,
    });
  }
  async findBills(): Promise<Legislation[]> {
    return await this.legislationRepository.findAll({
      where: {
        type: LegislationType.ACT,
        status: LegislationStatus.BILL,
      },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
  }
  async findConventions(): Promise<Legislation[]> {
    return await this.legislationRepository.findAll({
      where: {
        type: LegislationType.CONVENTION,
        status: LegislationStatus.ENACTED,
      },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
  }

  async searchByAlphabet(alphabet: string): Promise<Legislation[]> {
    return await Legislation.findAll({
      where: {
        title_eng: {
          [Op.startsWith]: alphabet,
        },
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
  }

  async remove(id: number) {
    return await this.legislationRepository.destroy({
      where: {
        id: id,
      },
    });
  }

  // ************* PUBLIC ROUTES *********************//

  async publicFindCurrentLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.ACT,
      status: LegislationStatus.ENACTED,
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

    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
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
  async publicFindRepealedLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.ACT,
      status: LegislationStatus.REPEALED,
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

    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
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
  async publicFindBilledLegislationsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.ACT,
      status: LegislationStatus.BILL,
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

    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
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

  async publicFindAllConventionsPaginated({
    page = 1,
    limit = 10,
    startingCharacter,
    effectiveYear,
  }): Promise<PaginatedResult<Legislation>> {
    // Corrected offset calculation
    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const whereClause: any = {
      type: LegislationType.CONVENTION,
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

    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: [
        'id',
        'type',
        'title_eng',
        'title_dzo',
        'documentYear',
        'status',
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
