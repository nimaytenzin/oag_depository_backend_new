import { Test, TestingModule } from '@nestjs/testing';
import { AnnexureController } from './annexure.controller';
import { AnnexureService } from './annexure.service';

describe('AnnexureController', () => {
  let controller: AnnexureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnexureController],
      providers: [AnnexureService],
    }).compile();

    controller = module.get<AnnexureController>(AnnexureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
