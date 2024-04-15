import { Module } from '@nestjs/common';
import { LegislationGroupService } from './legislation-group.service';
import { LegislationGroupController } from './legislation-group.controller';
import { LegislationGroup } from './entities/legislation-group.entity';

@Module({
  controllers: [LegislationGroupController],
  providers: [
    LegislationGroupService,
    {
      provide: 'LEGISLATION_GROUP_REPOSITORY',
      useValue: LegislationGroup,
    },
  ],
  exports: [LegislationGroupService],
})
export class LegislationGroupModule {}
