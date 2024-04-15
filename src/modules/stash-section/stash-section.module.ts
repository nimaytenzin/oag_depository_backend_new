import { Module } from '@nestjs/common';
import { StashSectionService } from './stash-section.service';
import { StashSectionController } from './stash-section.controller';
import { StashSection } from './entities/stash-section.entity';

@Module({
  controllers: [StashSectionController],
  providers: [StashSectionService,
    { provide: 'STASH_SECTION_REPOSITORY', useValue: StashSection},
  ],
  exports:[StashSectionService]
})
export class StashSectionModule {}
