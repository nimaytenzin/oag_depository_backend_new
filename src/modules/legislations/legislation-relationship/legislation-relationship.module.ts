import { Module } from '@nestjs/common';
import { LegislationRelationshipService } from './legislation-relationship.service';
import { LegislationRelationshipController } from './legislation-relationship.controller';
import { LegislationRelationship } from './entities/legislation-relationship.entity';
import { LegislationService } from '../legislation/legislation.service';

@Module({
  controllers: [LegislationRelationshipController],
  providers: [
    LegislationRelationshipService,
    {
      provide: 'LEGISLATION_RELATIONSHIP_REPOSITORY',
      useValue: LegislationRelationship,
    },
  ],
  exports: [LegislationRelationshipService],
})
export class LegislationRelationshipModule {}
