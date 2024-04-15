import { Module } from '@nestjs/common';
import { DelegatedLegislationGroupService } from './delegated-legislation-group.service';
import { DelegatedLegislationGroupController } from './delegated-legislation-group.controller';
import { DelegatedLegislationGroup } from './entities/delegated-legislation-group.entity';

@Module({
  controllers: [DelegatedLegislationGroupController],
  providers: [
    DelegatedLegislationGroupService,
    {
      provide: 'DELEGATED_LEGISLATION_GROUP_REPOSITORY',
      useValue: DelegatedLegislationGroup,
    },
  ],
  exports: [DelegatedLegislationGroupService],
})
export class DelegatedLegislationGroupModule {}
