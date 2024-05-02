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
import { SEARCHEXCLUDEDKEYWORDS } from 'src/constants/constants';
import { LegislationRelationshipService } from '../legislation-relationship/legislation-relationship.service';

@Injectable()
export class LegislationService {
  constructor(
    @Inject('LEGISLATION_REPOSITORY')
    private readonly legislationRepository: typeof Legislation,
    private readonly sectionService: SectionService,
    private readonly annexureService: AnnexureService,
    private readonly documentCopyService: DocumentCopyService,
    private readonly legislationGroupService: LegislationGroupService,
    private readonly legislationRelationshipService: LegislationRelationshipService,
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

  async findAllMinified() {
    return await this.legislationRepository.findAll({
      attributes: ['id', 'title_eng', 'title_dzo', 'status', 'isPublished'],
    });
  }

  async findHeadLegislationNodeId(legislationId: number): Promise<number> {
    let currentLegislationId = legislationId;
    while (true) {
      const repealingLegislations =
        await this.legislationRelationshipService.findAllRepealingLegislation(
          currentLegislationId,
        );
      // Check if the first repealing legislation exists and has an actingLegislationId
      if (
        repealingLegislations.length > 0 &&
        repealingLegislations[0].actingLegislationId
      ) {
        console.log(
          '\n\nCURRENT LEGISLATION ID',
          currentLegislationId,
          'REPEALED BY',
          repealingLegislations[0].actingLegislationId,
        );
        currentLegislationId = repealingLegislations[0].actingLegislationId;
        console.log('\n\nCURRENT LEGISLATION ID', currentLegislationId);
      } else {
        console.log('\n\n', 'Head = ', currentLegislationId);
        return currentLegislationId;
      }
    }
  }

  // async findLegislativeHistory(legislationId: number) {
  //   const headId = await this.findHeadLegislationNodeId(legislationId);

  //   const repealedLegisaltion =
  //     this.legislationRelationshipService.findAllReapealedByLegisaltion(headId);

  //     for(let)
  // }

  // async findLegislativeHistoryByLegislation(
  //   legislationId: number,
  // ): Promise<any> {
  //   const history = [];
  //   const repealedLegislations =
  //     await this.legislationRelationshipService.findAllReapealedByLegisaltion(
  //       legislationId,
  //     );

  //   console.log('REPEALED');
  //   // For each repealed legislation, recursively find its history
  //   for (const repealedLegislation of repealedLegislations) {
  //     const repealedLegislationHistory =
  //       await this.findLegislativeHistoryByLegislation(
  //         repealedLegislation.affectedLegislationId,
  //       );
  //     history.push({
  //       parent: {
  //         legislationId: repealedLegislation.actingLegislationId,
  //         action: repealedLegislation.action,
  //         child: repealedLegislationHistory,
  //       },
  //     });
  //   }

  //   return history;
  // }

  async findRepealHistory(legislationId: number) {
    const headNodeId = await this.findHeadLegislationNodeId(legislationId);
    return await this.findRepealedLegislationTree(headNodeId);
  }

  async findRepealedLegislationTree(legislationId: number): Promise<any> {
    // Find all legislations repealed by the given legislation ID

    const repealedLegislations =
      await this.legislationRelationshipService.findAllReapealedByLegisaltion(
        legislationId,
      );

    // Initialize the tree with the given legislation ID as the root
    const tree = {
      legislationId: legislationId,
      repealedLegislations: [],
    };

    // Recursively find repealed legislations for each repealed legislation
    for (const repealedLegislation of repealedLegislations) {
      const repealedLegislationTree = await this.findRepealedLegislationTree(
        repealedLegislation.affectedLegislationId,
      );
      repealedLegislationTree.legislationRelationshipId =
        repealedLegislation.id;

      repealedLegislationTree.mode = repealedLegislation.mode;
      // Add the repealed legislation tree to the current legislation's list of repealed legislations
      tree.repealedLegislations.push(repealedLegislationTree);
    }

    return tree;
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

  async PublicsearchForKeywordInLegislationWithinTitle(
    keywords: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResult<Legislation>> {
    const keywordsParsed = keywords.split(',');
    const excludedWords = SEARCHEXCLUDEDKEYWORDS;
    const filteredKeywords = keywordsParsed
      .map((keyword) => keyword.trim())
      .filter((keyword) => !excludedWords.includes(keyword));
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        title_eng: {
          [Op.like]: term,
        },
      })),
    };

    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const result = await this.legislationRepository.findAndCountAll({
      where: whereClause,
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

  // ************** DRAFT LEGISLATIONS ROUTES ADMIN ************//

  async findDraftLegislationsPaginated({
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
      isPublished: false,
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
      order: [['createdAt', 'DESC']],
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
