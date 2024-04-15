import { Test, TestingModule } from '@nestjs/testing';
import { StashDelegatedLegislationController } from './stash-delegated-legislation.controller';
import { StashDelegatedLegislationService } from './stash-delegated-legislation.service';

describe('StashDelegatedLegislationController', () => {
  let controller: StashDelegatedLegislationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StashDelegatedLegislationController],
      providers: [StashDelegatedLegislationService],
    }).compile();

    controller = module.get<StashDelegatedLegislationController>(StashDelegatedLegislationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
