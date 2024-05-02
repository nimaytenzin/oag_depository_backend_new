import { Inject, Injectable } from '@nestjs/common';
import { PublishedLegislationStatisticsSummaryDto } from './dto/legislation-stats.dto';
import { LegislationService } from '../../legislations/legislation/legislation.service';
import { DelegatedLegislationService } from '../../delegated-legislations/delegated-legislation/delegated-legislation.service';
import { Legislation } from '../../legislations/legislation/entities/legislation.entity';
import {
  DelegatedLegislationStatus,
  LegislationStatus,
  LegislationType,
} from 'src/constants/enums';
import { DelegatedLegislation } from '../../delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';
import { PublishedDelegatedLegislationStatisticsSummaryDto } from './dto/delegated-legislation-stats.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject('LEGISLATION_REPOSITORY')
    private readonly legislationRepository: typeof Legislation,
    @Inject('DELEGATED_LEGISLATION_REPOSITORY')
    private readonly delegatedLegislationRepository: typeof DelegatedLegislation,
  ) {}

  async getPublishedLegislationStats(): Promise<PublishedLegislationStatisticsSummaryDto> {
    const data: PublishedLegislationStatisticsSummaryDto = {
      current: 0,
      repealed: 0,
      bills: 0,
      ammendments: 0,
      conventions: 0,
      total: 0,
    };
    data.total = await this.legislationRepository.count();
    data.current = await this.legislationRepository.count({
      where: {
        isActive: true,
        isPublished: true,
        type: LegislationType.ACT,
        status: LegislationStatus.ENACTED,
      },
    });
    data.repealed = await this.legislationRepository.count({
      where: {
        isActive: true,
        isPublished: true,
        type: LegislationType.ACT,
        status: LegislationStatus.REPEALED,
      },
    });
    data.bills = await this.legislationRepository.count({
      where: {
        isActive: true,
        isPublished: true,
        type: LegislationType.ACT,
        status: LegislationStatus.BILL,
      },
    });

    return data;
  }

  async getDelegatedLegislationStats() {
    const data: PublishedDelegatedLegislationStatisticsSummaryDto = {
      current: 0,
      revoked: 0,
      modified: 0,
      total: 0,
    };

    data.total = await this.delegatedLegislationRepository.count({});
    data.current = await this.delegatedLegislationRepository.count({
      where: {
        isActive: true,
        isPublished: true,
        status: DelegatedLegislationStatus.ENACTED,
      },
    });
    data.revoked = await this.legislationRepository.count({
      where: {
        isActive: true,
        isPublished: true,

        status: DelegatedLegislationStatus.REVOKED,
      },
    });
    data.modified = await this.legislationRepository.count({
      where: {
        isActive: true,
        isPublished: true,
        status: DelegatedLegislationStatus.MODIFIED,
      },
    });

    return data;
  }
}
