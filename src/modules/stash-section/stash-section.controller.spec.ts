import { Test, TestingModule } from '@nestjs/testing';
import { StashSectionController } from './stash-section.controller';
import { StashSectionService } from './stash-section.service';

describe('StashSectionController', () => {
  let controller: StashSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StashSectionController],
      providers: [StashSectionService],
    }).compile();

    controller = module.get<StashSectionController>(StashSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
