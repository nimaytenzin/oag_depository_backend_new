import { Test, TestingModule } from '@nestjs/testing';
import { LegislationGroupController } from './legislation-group.controller';
import { LegislationGroupService } from './legislation-group.service';

describe('LegislationGroupController', () => {
  let controller: LegislationGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegislationGroupController],
      providers: [LegislationGroupService],
    }).compile();

    controller = module.get<LegislationGroupController>(
      LegislationGroupController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
