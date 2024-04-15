import { Test, TestingModule } from '@nestjs/testing';
import { AmendmentController } from './amendment.controller';
import { AmendmentService } from './amendment.service';

describe('AmendmentController', () => {
  let controller: AmendmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmendmentController],
      providers: [AmendmentService],
    }).compile();

    controller = module.get<AmendmentController>(AmendmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
