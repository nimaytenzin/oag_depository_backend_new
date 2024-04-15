import { Module } from '@nestjs/common';
import { ChangeValueService } from './change-value.service';
import { ChangeValueController } from './change-value.controller';
import { ChangeValue } from './entities/change-value.entity';

@Module({
  controllers: [ChangeValueController],
  providers: [ChangeValueService,
    { provide: 'CHANGE_VALUE_REPOSITORY', useValue: ChangeValue},
  ],
  exports:[ChangeValueService]
})
export class ChangeValueModule {}
