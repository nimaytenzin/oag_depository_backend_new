import { Module } from '@nestjs/common';
import { ViewCountService } from './view-count.service';
import { ViewCountController } from './view-count.controller';

@Module({
  controllers: [ViewCountController],
  providers: [ViewCountService]
})
export class ViewCountModule {}
