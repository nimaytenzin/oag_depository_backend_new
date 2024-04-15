import { Module } from '@nestjs/common';
import { StashDelegatedLegislationService } from './stash-delegated-legislation.service';
import { StashDelegatedLegislationController } from './stash-delegated-legislation.controller';
import { StashDelegatedLegislation } from './entities/stash-delegated-legislation.entity';

@Module({
  controllers: [StashDelegatedLegislationController],
  providers: [StashDelegatedLegislationService,
    { provide: 'STASH_DELEGATED_LEGISLATION_REPOSITORY', useValue: StashDelegatedLegislation},
  ],
  exports:[StashDelegatedLegislationService]
})
export class StashDelegatedLegislationModule {}
