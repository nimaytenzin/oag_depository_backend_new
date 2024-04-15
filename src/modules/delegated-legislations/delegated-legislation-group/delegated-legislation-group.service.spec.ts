import { Test, TestingModule } from '@nestjs/testing';
import { DelegatedLegislationGroupService } from './delegated-legislation-group.service';

describe('DelegatedLegislationGroupService', () => {
  let service: DelegatedLegislationGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DelegatedLegislationGroupService],
    }).compile();

    service = module.get<DelegatedLegislationGroupService>(
      DelegatedLegislationGroupService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
