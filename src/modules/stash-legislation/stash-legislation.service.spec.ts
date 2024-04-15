import { Test, TestingModule } from '@nestjs/testing';
import { StashLegislationService } from './stash-legislation.service';

describe('StashLegislationService', () => {
  let service: StashLegislationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StashLegislationService],
    }).compile();

    service = module.get<StashLegislationService>(StashLegislationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
