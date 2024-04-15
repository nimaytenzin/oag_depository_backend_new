import { Test, TestingModule } from '@nestjs/testing';
import { LegislationGroupService } from './legislation-group.service';

describe('LegislationGroupService', () => {
  let service: LegislationGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegislationGroupService],
    }).compile();

    service = module.get<LegislationGroupService>(LegislationGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
