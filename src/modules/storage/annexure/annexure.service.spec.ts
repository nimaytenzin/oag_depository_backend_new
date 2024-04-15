import { Test, TestingModule } from '@nestjs/testing';
import { AnnexureService } from './annexure.service';

describe('AnnexureService', () => {
  let service: AnnexureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnexureService],
    }).compile();

    service = module.get<AnnexureService>(AnnexureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
