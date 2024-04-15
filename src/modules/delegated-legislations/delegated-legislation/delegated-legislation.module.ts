import { Module } from '@nestjs/common';
import { DelegatedLegislationService } from './delegated-legislation.service';
import { DelegatedLegislationController } from './delegated-legislation.controller';
import { DelegatedLegislation } from './entities/delegated-legislation.entity';
import { SectionModule } from 'src/modules/section/section.module';
import { DelegatedLegislationGroupModule } from '../delegated-legislation-group/delegated-legislation-group.module';

@Module({
  controllers: [DelegatedLegislationController],
  providers: [
    DelegatedLegislationService,
    {
      provide: 'DELEGATED_LEGISLATION_REPOSITORY',
      useValue: DelegatedLegislation,
    },
  ],
  imports: [SectionModule, DelegatedLegislationGroupModule],
  exports:[DelegatedLegislationService]
})
export class DelegatedLegislationModule {}
