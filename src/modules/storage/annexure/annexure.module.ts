import { Module } from '@nestjs/common';
import { AnnexureService } from './annexure.service';
import { AnnexureController } from './annexure.controller';
import { Annexure } from './entities/annexure.entity';

@Module({
  controllers: [AnnexureController],
  providers: [
    AnnexureService,
    {
      provide: 'ANNEXURE_REPOSITORY',
      useValue: Annexure,
    },
  ],
  exports: [AnnexureService],
})
export class AnnexureModule {}
