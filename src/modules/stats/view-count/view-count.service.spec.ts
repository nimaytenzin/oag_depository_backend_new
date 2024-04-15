import { Test, TestingModule } from '@nestjs/testing';
import { ViewCountService } from './view-count.service';

describe('ViewCountService', () => {
  let service: ViewCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewCountService],
    }).compile();

    service = module.get<ViewCountService>(ViewCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
