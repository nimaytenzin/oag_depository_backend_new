import { Test, TestingModule } from '@nestjs/testing';
import { DelegatedLegislationGroupController } from './delegated-legislation-group.controller';
import { DelegatedLegislationGroupService } from './delegated-legislation-group.service';

describe('DelegatedLegislationGroupController', () => {
  let controller: DelegatedLegislationGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelegatedLegislationGroupController],
      providers: [DelegatedLegislationGroupService],
    }).compile();

    controller = module.get<DelegatedLegislationGroupController>(DelegatedLegislationGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
