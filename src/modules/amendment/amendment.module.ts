import { Module } from '@nestjs/common';
import { AmendmentService } from './amendment.service';
import { AmendmentController } from './amendment.controller';
import { Amendment } from './entities/amendment.entity';
import { StashDelegatedLegislationModule } from '../stash-delegated-legislation/stash-delegated-legislation.module';
import { StashLegislationModule } from '../stash-legislation/stash-legislation.module';
import { StashSectionModule } from '../stash-section/stash-section.module';
import { ChangeModule } from '../change/change.module';
import { ChangeValueModule } from '../change-value/change-value.module';
import { DelegatedLegislationModule } from '../delegated-legislations/delegated-legislation/delegated-legislation.module';
import { LegislationModule } from '../legislations/legislation/legislation.module';
import { SectionModule } from '../section/section.module';

@Module({
  controllers: [AmendmentController],
  providers: [AmendmentService,
    { provide: 'AMENDMENT_REPOSITORY', useValue: Amendment},
  ],
  exports:[AmendmentService],
  imports:[
    LegislationModule,
    DelegatedLegislationModule,
    SectionModule,
    StashDelegatedLegislationModule,
    StashLegislationModule,
    StashSectionModule,
    ChangeModule,
    ChangeValueModule,
  ]
})
export class AmendmentModule {}
