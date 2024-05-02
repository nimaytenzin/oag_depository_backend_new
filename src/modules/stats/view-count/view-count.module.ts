import { Module } from '@nestjs/common';
import { ViewCountService } from './view-count.service';
import { ViewCountController } from './view-count.controller';
import { ViewCount } from './entities/view-count.entity';

@Module({
  controllers: [ViewCountController],
  providers: [
    ViewCountService,
    { provide: 'VIEWCOUNT_REPO', useValue: ViewCount },
  ],
})
export class ViewCountModule {}
