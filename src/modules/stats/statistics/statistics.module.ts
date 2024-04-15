import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { LegislationModule } from '../../legislations/legislation/legislation.module';
import { DelegatedLegislationModule } from '../../delegated-legislations/delegated-legislation/delegated-legislation.module';
import { Legislation } from '../../legislations/legislation/entities/legislation.entity';
import { DelegatedLegislation } from '../../delegated-legislations/delegated-legislation/entities/delegated-legislation.entity';

@Module({
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    { provide: 'LEGISLATION_REPOSITORY', useValue: Legislation },
    {
      provide: 'DELEGATED_LEGISLATION_REPOSITORY',
      useValue: DelegatedLegislation,
    },
  ],
  imports: [LegislationModule, DelegatedLegislationModule],
})
export class StatisticsModule {}
