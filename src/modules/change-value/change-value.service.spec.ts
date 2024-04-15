import { Test, TestingModule } from '@nestjs/testing';
import { ChangeValueService } from './change-value.service';

describe('ChangeValueService', () => {
  let service: ChangeValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeValueService],
    }).compile();

    service = module.get<ChangeValueService>(ChangeValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
