import { Test, TestingModule } from '@nestjs/testing';
import { StashLegislationController } from './stash-legislation.controller';
import { StashLegislationService } from './stash-legislation.service';

describe('StashLegislationController', () => {
  let controller: StashLegislationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StashLegislationController],
      providers: [StashLegislationService],
    }).compile();

    controller = module.get<StashLegislationController>(StashLegislationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
