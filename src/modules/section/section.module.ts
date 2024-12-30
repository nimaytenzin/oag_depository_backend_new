import { Section } from './entities/section.entity';
import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { SearchModule } from '../search/search.module';

@Module({
  controllers: [SectionController],
  providers: [
    SectionService,
    { provide: 'SECTION_REPOSITORY', useValue: Section },
  ],
  exports: [SectionService],
  imports:[SearchModule]
})
export class SectionModule {}
