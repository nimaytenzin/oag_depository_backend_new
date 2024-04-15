import { Test, TestingModule } from '@nestjs/testing';
import { ViewCountController } from './view-count.controller';
import { ViewCountService } from './view-count.service';

describe('ViewCountController', () => {
  let controller: ViewCountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewCountController],
      providers: [ViewCountService],
    }).compile();

    controller = module.get<ViewCountController>(ViewCountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
