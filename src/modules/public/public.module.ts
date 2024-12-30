import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { LegislationModule } from '../legislations/legislation/legislation.module';
import { DelegatedLegislationModule } from '../delegated-legislations/delegated-legislation/delegated-legislation.module';
import { SectionModule } from '../section/section.module';
import { SearchModule } from '../search/search.module';

@Module({
  controllers: [PublicController],
  providers: [PublicService],
  imports: [LegislationModule, DelegatedLegislationModule, SectionModule, SearchModule],
})
export class PublicModule { }
