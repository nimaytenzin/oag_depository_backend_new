import { Test, TestingModule } from '@nestjs/testing';
import { StashDelegatedLegislationService } from './stash-delegated-legislation.service';

describe('StashDelegatedLegislationService', () => {
  let service: StashDelegatedLegislationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StashDelegatedLegislationService],
    }).compile();

    service = module.get<StashDelegatedLegislationService>(StashDelegatedLegislationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
