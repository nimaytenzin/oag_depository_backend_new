import { Test, TestingModule } from '@nestjs/testing';
import { ChangeValueController } from './change-value.controller';
import { ChangeValueService } from './change-value.service';

describe('ChangeValueController', () => {
  let controller: ChangeValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangeValueController],
      providers: [ChangeValueService],
    }).compile();

    controller = module.get<ChangeValueController>(ChangeValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
