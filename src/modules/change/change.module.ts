import { Module } from '@nestjs/common';
import { ChangeService } from './change.service';
import { ChangeController } from './change.controller';
import { Change } from './entities/change.entity';

@Module({
  controllers: [ChangeController],
  providers: [ChangeService,
    { provide: 'CHANGE_REPOSITORY', useValue: Change},
  ],
  exports:[ChangeService]
})
export class ChangeModule {}
