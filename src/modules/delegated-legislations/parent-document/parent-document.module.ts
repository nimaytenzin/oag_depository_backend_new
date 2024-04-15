import { Module } from '@nestjs/common';
import { ParentDocumentService } from './parent-document.service';
import { ParentDocumentController } from './parent-document.controller';
import { ParentDocument } from './entities/parent-document.entity';

@Module({
  controllers: [ParentDocumentController],
  providers: [
    ParentDocumentService,
    {
      provide: 'PARENT_DOCUMENT_REPOSITORY',
      useValue: ParentDocument,
    },
  ],
})
export class ParentDocumentModule {}
