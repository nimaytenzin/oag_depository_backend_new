import { Module } from '@nestjs/common';
import { DocumentCopyService } from './document-copy.service';
import { DocumentCopyController } from './document-copy.controller';
import { DocumentCopy } from './entities/document-copy.entity';

@Module({
  controllers: [DocumentCopyController],
  providers: [
    DocumentCopyService,
    {
      provide: 'DOCUMENT_COPY_REPOSITORY',
      useValue: DocumentCopy,
    },
  ],
  exports: [DocumentCopyService],
})
export class DocumentCopyModule {}
