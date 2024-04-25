import { Legislation } from './entities/legislation.entity';
import { Module } from '@nestjs/common';
import { LegislationService } from './legislation.service';
import { LegislationController } from './legislation.controller';
import { SectionModule } from '../../section/section.module';
import { AnnexureModule } from 'src/modules/storage/annexure/annexure.module';
import { DocumentCopyModule } from 'src/modules/storage/document-copy/document-copy.module';
import { LegislationGroupModule } from '../legislation-group/legislation-group.module';
import { LegislationRelationshipModule } from '../legislation-relationship/legislation-relationship.module';

@Module({
  controllers: [LegislationController],
  providers: [
    LegislationService,
    { provide: 'LEGISLATION_REPOSITORY', useValue: Legislation },
  ],
  imports: [
    SectionModule,
    AnnexureModule,
    DocumentCopyModule,
    LegislationGroupModule,
    LegislationRelationshipModule,
  ],
  exports: [LegislationService],
})
export class LegislationModule {}
