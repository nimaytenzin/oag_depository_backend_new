import { Test, TestingModule } from '@nestjs/testing';
import { StashSectionService } from './stash-section.service';

describe('StashSectionService', () => {
  let service: StashSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StashSectionService],
    }).compile();

    service = module.get<StashSectionService>(StashSectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
