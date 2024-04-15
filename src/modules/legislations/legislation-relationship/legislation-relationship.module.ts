import { Module } from '@nestjs/common';
import { LegislationRelationshipService } from './legislation-relationship.service';
import { LegislationRelationshipController } from './legislation-relationship.controller';
import { LegislationRelationship } from './entities/legislation-relationship.entity';

@Module({
  controllers: [LegislationRelationshipController],
  providers: [
    LegislationRelationshipService,
    {
      provide: 'LEGISLATION_RELATIONSHIP_REPOSITORY',
      useValue: LegislationRelationship,
    },
  ],
})
export class LegislationRelationshipModule {}
