import { Section } from './entities/section.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Op } from 'sequelize';
import { Legislation } from '../legislations/legislation/entities/legislation.entity';
import { instanceToPlain } from 'class-transformer';
import { SectionType } from 'src/constants/enums';
import { CreateSectionDto, InsertSectionDto } from './dto/create-section.dto';
import { Change } from '../change/entities/change.entity';
import { Amendment } from '../amendment/entities/amendment.entity';
import { ChangeValue } from '../change-value/entities/change-value.entity';
import { PaginatedResult } from 'src/utilities/pagination';
import { SEARCHEXCLUDEDKEYWORDS } from 'src/constants/constants';
import { DelegatedLegislation } from '../delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';

@Injectable()
export class SectionService {
  constructor(
    @Inject('SECTION_REPOSITORY')
    private readonly sectionRepository: typeof Section,
  ) {}

  async fields() {
    const sections = await this.sectionRepository.getAttributes();
    return Object.keys(sections);
  }

  async create(createSectionDto: CreateSectionDto) {
    if (createSectionDto.legislationId) {
      createSectionDto.order = await this.getNextOrderNumber(
        createSectionDto.legislationId,
      );
    } else {
      createSectionDto.order =
        await this.getNextOrderNumberDelegatedLegislation(
          createSectionDto.delegatedLegislationId,
        );
    }

    return this.sectionRepository.create(instanceToPlain(createSectionDto));
  }

  insertInBetween(data: InsertSectionDto) {
    const newDraftSection: CreateSectionDto = {
      ...data,
      order: this.getOrderNumberInBetween(data.topOrder, data.bottomOrder),
    };
    console.log('IJOJDS\n\n', newDraftSection);
    return this.sectionRepository.create(instanceToPlain(newDraftSection));
  }

  getNextOrderNumber(draftLegislationNumber: number): Promise<number> {
    return this.sectionRepository
      .max('order', {
        where: { legislationId: draftLegislationNumber },
      })
      .then((maxOrder: number) => {
        return maxOrder ? maxOrder + 1 : 1;
      });
  }
  getNextOrderNumberDelegatedLegislation(
    draftLegislationNumber: number,
  ): Promise<number> {
    return this.sectionRepository
      .max('order', {
        where: { delegatedLegislationId: draftLegislationNumber },
      })
      .then((maxOrder: number) => {
        return maxOrder ? maxOrder + 1 : 1;
      });
  }

  getOrderNumberInBetween(order1: number, order2: number): number {
    console.log('\n\n\n   GETTING ORDER BETWEEN', order1, order2);
    return (order1 + order2) / 2;
  }

  createBulk(sectionDataArray) {
    return this.sectionRepository.bulkCreate(sectionDataArray);
  }

  async findAll() {
    return await this.sectionRepository.findAll();
  }

  async searchClause(searchString: string) {
    const keywords = searchString.split(' ');
    // Define the excluded words
    const excludedWords = [
      'a',
      'an',
      'the',
      'and',
      'but',
      'or',
      'if',
      'then',
      'else',
      'for',
      'of',
      'with',
      'without',
      'in',
      'on',
      'at',
      'by',
      'about',
      'over',
      'under',
      'above',
      'below',
      'to',
      'from',
      'up',
      'down',
      'over',
      'under',
      'between',
      'among',
      'through',
      'during',
      'before',
      'after',
      'while',
      'since',
      'until',
      'so',
      'because',
      'although',
      'though',
      'unless',
      'until',
      'when',
      'where',
      'why',
      'how',
      'what',
      'which',
      'who',
      'whom',
      'whose',
      'that',
      'there',
      'here',
      'just',
      'only',
      'very',
      'really',
      'quite',
      'too',
      'much',
    ];
    // Filter out excluded words from the keywords
    const filteredKeywords = keywords.filter(
      (keyword) => !excludedWords.includes(keyword),
    );
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        clause_eng: {
          [Op.like]: term,
        },
      })),
    };
    return await this.sectionRepository.findAll({
      where: whereClause,
      include: [Legislation],
    });
  }

  async searchClauseInLegislation(searchString: string, legislationId) {
    const keywords = searchString.split(' ');
    // Define the excluded words
    const excludedWords = [
      'a',
      'an',
      'the',
      'and',
      'but',
      'or',
      'if',
      'then',
      'else',
      'for',
      'of',
      'with',
      'without',
      'in',
      'on',
      'at',
      'by',
      'about',
      'over',
      'under',
      'above',
      'below',
      'to',
      'from',
      'up',
      'down',
      'over',
      'under',
      'between',
      'among',
      'through',
      'during',
      'before',
      'after',
      'while',
      'since',
      'until',
      'so',
      'because',
      'although',
      'though',
      'unless',
      'until',
      'when',
      'where',
      'why',
      'how',
      'what',
      'which',
      'who',
      'whom',
      'whose',
      'that',
      'there',
      'here',
      'just',
      'only',
      'very',
      'really',
      'quite',
      'too',
      'much',
    ];
    // Filter out excluded words from the keywords
    const filteredKeywords = keywords.filter(
      (keyword) => !excludedWords.includes(keyword),
    );
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        clause_eng: {
          [Op.like]: term,
        },
        legislationId: legislationId,
      })),
    };
    return await this.sectionRepository.findAll({
      where: whereClause,
      include: [Legislation],
    });
  }
  async searchClauseInDelegatedLegislation(
    searchString: string,
    delegatedLegisaltionId,
  ) {
    const keywords = searchString.split(' ');
    // Define the excluded words
    const excludedWords = [
      'a',
      'an',
      'the',
      'and',
      'but',
      'or',
      'if',
      'then',
      'else',
      'for',
      'of',
      'with',
      'without',
      'in',
      'on',
      'at',
      'by',
      'about',
      'over',
      'under',
      'above',
      'below',
      'to',
      'from',
      'up',
      'down',
      'over',
      'under',
      'between',
      'among',
      'through',
      'during',
      'before',
      'after',
      'while',
      'since',
      'until',
      'so',
      'because',
      'although',
      'though',
      'unless',
      'until',
      'when',
      'where',
      'why',
      'how',
      'what',
      'which',
      'who',
      'whom',
      'whose',
      'that',
      'there',
      'here',
      'just',
      'only',
      'very',
      'really',
      'quite',
      'too',
      'much',
    ];
    // Filter out excluded words from the keywords
    const filteredKeywords = keywords.filter(
      (keyword) => !excludedWords.includes(keyword),
    );
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        clause_eng: {
          [Op.like]: term,
        },
        delegatedLegislationId: delegatedLegisaltionId,
      })),
    };
    return await this.sectionRepository.findAll({
      where: whereClause,
      include: [DelegatedLegislation],
    });
  }

  async findSectionsByLegislationId(legislationId: number): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        legislationId: legislationId,
      },
      order: [['order', 'ASC']],
      include: [
        {
          model: Change,
          order: [['id', 'DESC']],
          include: [{ model: Amendment }, { model: ChangeValue }],
        },
      ],
    });
  }

  async findSectionsByDelegatedLegislationId(
    delegatedLegislationId: number,
  ): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        delegatedLegislationId: delegatedLegislationId,
      },
      order: [['order', 'ASC']],
      include: [
        {
          model: Change,
          order: [['id', 'DESC']],
          include: [{ model: Amendment }, { model: ChangeValue }],
        },
      ],
    });
  }

  async findHeadingsByLegislation(legislationId: number): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        legislationId: legislationId,
        type: {
          [Op.in]: [
            SectionType.HEADING_1,
            SectionType.HEADING_2,
            SectionType.HEADING_3,
            SectionType.SUBSECTION_H1,
            SectionType.SUBSECTION_H2,
          ],
        },
      },
    });
  }
  async findHeadingsByDelegatedLegislation(
    delegatedLegislationId: number,
  ): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        delegatedLegislationId: delegatedLegislationId,
        type: {
          [Op.in]: [
            SectionType.HEADING_1,
            SectionType.HEADING_2,
            SectionType.HEADING_3,
            SectionType.SUBSECTION_H1,
            SectionType.SUBSECTION_H2,
          ],
        },
      },
    });
  }

  async findOne(id: number): Promise<Section> {
    return await this.sectionRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateSectionDto) {
    const section = await this.sectionRepository.findByPk(id);
    if (!section) {
      throw new HttpException(
        'Update section failed. Not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    await section.update(instanceToPlain(updateSectionDto));
    return section;
  }
  async softDelete(id: number) {
    const section = await this.sectionRepository.findByPk(id);
    if (!section) {
      throw new HttpException(
        'Update section failed. Not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    await section.update({
      softDelete: true,
    });
    return section;
  }

  async remove(id: number) {
    return await this.sectionRepository.destroy({
      where: {
        id: id,
      },
    });
  }

  //******************** */ PUBLIC ROUTES *******************//

  async publicfindSectionsByLegislationId(
    legislationId: number,
  ): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        legislationId: legislationId,
      },
      attributes: ['id', 'type', 'clause_eng', 'clause_dzo'],
      order: [['order', 'ASC']],
      include: [
        {
          model: Change,
          order: [['id', 'DESC']],
          include: [{ model: Amendment }, { model: ChangeValue }],
        },
      ],
    });
  }

  async publicfindSectionsByDelegatedLegislationId(
    delegatedLegislationId: number,
  ): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        delegatedLegislationId: delegatedLegislationId,
      },
      order: [['order', 'ASC']],
      include: [
        {
          model: Change,
          order: [['id', 'DESC']],
          include: [{ model: Amendment }, { model: ChangeValue }],
        },
      ],
    });
  }
  async publicFindHeadingsByDelegatedLegislation(
    delegatedLegislationId: number,
  ): Promise<Section[]> {
    return await this.sectionRepository.findAll({
      where: {
        delegatedLegislationId: delegatedLegislationId,
        type: {
          [Op.in]: [
            SectionType.HEADING_1,
            SectionType.HEADING_2,
            SectionType.HEADING_3,
            SectionType.SUBSECTION_H1,
            SectionType.SUBSECTION_H2,
          ],
        },
      },
    });
  }

  async PublicSearchClauseInDelegatedLegislation(
    searchString: string,
    delegatedLegislationId,
  ) {
    const keywords = searchString.split(' ');
    // Define the excluded words
    const excludedWords = [
      'a',
      'an',
      'the',
      'and',
      'but',
      'or',
      'if',
      'then',
      'else',
      'for',
      'of',
      'with',
      'without',
      'in',
      'on',
      'at',
      'by',
      'about',
      'over',
      'under',
      'above',
      'below',
      'to',
      'from',
      'up',
      'down',
      'over',
      'under',
      'between',
      'among',
      'through',
      'during',
      'before',
      'after',
      'while',
      'since',
      'until',
      'so',
      'because',
      'although',
      'though',
      'unless',
      'until',
      'when',
      'where',
      'why',
      'how',
      'what',
      'which',
      'who',
      'whom',
      'whose',
      'that',
      'there',
      'here',
      'just',
      'only',
      'very',
      'really',
      'quite',
      'too',
      'much',
    ];
    // Filter out excluded words from the keywords
    const filteredKeywords = keywords.filter(
      (keyword) => !excludedWords.includes(keyword),
    );
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        clause_eng: {
          [Op.like]: term,
        },
        delegatedLegislationId: delegatedLegislationId,
      })),
    };
    return await this.sectionRepository.findAll({
      where: whereClause,
      include: [Legislation],
    });
  }

  //PUBLIC ADVANCED SEARCH

  async PublicsearchForKeywordInLegislationWithinContent({
    keywords,
    page = 1,
    limit = 50,
  }): Promise<PaginatedResult<Section>> {
    const keywordsParsed = keywords.split(',');
    const excludedWords = SEARCHEXCLUDEDKEYWORDS;
    const filteredKeywords = keywordsParsed
      .map((keyword) => keyword.trim())
      .filter((keyword) => !excludedWords.includes(keyword));
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        clause_eng: {
          [Op.like]: term,
        },
        legislationId: {
          [Op.not]: null, // This ensures that legislationId is not null
        },
      })),
    };

    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const result = await this.sectionRepository.findAndCountAll({
      where: whereClause,
      include: [Legislation],
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

  async PublicsearchForKeywordInDelegatedLegislationWithinContent({
    keywords,
    page = 1,
    limit = 50,
  }): Promise<PaginatedResult<Section>> {
    const keywordsParsed = keywords.split(',');
    const excludedWords = SEARCHEXCLUDEDKEYWORDS;
    const filteredKeywords = keywordsParsed
      .map((keyword) => keyword.trim())
      .filter((keyword) => !excludedWords.includes(keyword));
    const searchTerms = filteredKeywords.map((keyword) => `%${keyword}%`);
    const whereClause = {
      [Op.or]: searchTerms.map((term) => ({
        clause_eng: {
          [Op.like]: term,
        },
        delegatedLegislationId: {
          [Op.not]: null, // This ensures that legislationId is not null
        },
      })),
    };

    if (page <= 0) {
      page = 1;
    }
    let offset = (page - 1) * limit;

    const result = await this.sectionRepository.findAndCountAll({
      where: whereClause,
      include: [DelegatedLegislation],
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
}
