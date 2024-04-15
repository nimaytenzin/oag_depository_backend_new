import { Test, TestingModule } from '@nestjs/testing';
import { AmendmentService } from './amendment.service';

describe('AmendmentService', () => {
  let service: AmendmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmendmentService],
    }).compile();

    service = module.get<AmendmentService>(AmendmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
