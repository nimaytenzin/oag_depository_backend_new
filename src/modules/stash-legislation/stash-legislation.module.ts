import { Module } from '@nestjs/common';
import { StashLegislationService } from './stash-legislation.service';
import { StashLegislationController } from './stash-legislation.controller';
import { StashLegislation } from './entities/stash-legislation.entity';

@Module({
  controllers: [StashLegislationController],
  providers: [StashLegislationService,
    { provide: 'STASH_LEGISLATION_REPOSITORY', useValue: StashLegislation},
  ],
  exports:[StashLegislationService]
})
export class StashLegislationModule {}
