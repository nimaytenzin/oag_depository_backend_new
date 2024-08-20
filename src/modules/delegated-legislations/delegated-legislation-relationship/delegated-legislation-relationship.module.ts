import { Module } from '@nestjs/common';
import { DelegatedLegislationRelationshipService } from './delegated-legislation-relationship.service';
import { DelegatedLegislationRelationshipController } from './delegated-legislation-relationship.controller';
import { DelegatedLegislationRelationship } from './entities/delegated-legislation-relationship.entity';

@Module({
  controllers: [DelegatedLegislationRelationshipController],
  providers: [
    DelegatedLegislationRelationshipService,
    {
      provide: 'DELEGATED_LEGISLATION_RELATIONSHIP_REPOSITORY',
      useValue: DelegatedLegislationRelationship,
    },
  ],
  exports: [DelegatedLegislationRelationshipService],
})
export class DelegatedLegislationRelationshipModule {}
