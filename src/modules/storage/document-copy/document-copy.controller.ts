import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DocumentCopyService } from './document-copy.service';
import { CreateDocumentCopyDto } from './dto/create-document-copy.dto';
import { UpdateDocumentCopyDto } from './dto/update-document-copy.dto';
import { DocumentCopyUploadInterceptor } from 'src/interceptors/document.copy.interceptor.interceptor';

@Controller('document-copy')
export class DocumentCopyController {
  documentCopyFileLocation = '/storage/documentcopies/';
  constructor(private readonly documentCopyService: DocumentCopyService) {}

  @Post()
  @UseInterceptors(DocumentCopyUploadInterceptor)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentCopyDto: CreateDocumentCopyDto,
  ) {
    // const data: CreateDocumentCopyDto = {
    //   fileUri: this.documentCopyFileLocation + file.filename,
    //   refId: createDocumentCopyDto.refId,
    //   language: createDocumentCopyDto.language,
    //   type: createDocumentCopyDto.type,
    //   status: createDocumentCopyDto.status,
    // };
    // console.log('file upload data \n\n\n', data, '\n\n');
    // return this.documentCopyService.create(data);
  }

  @Get()
  findAll() {
    return this.documentCopyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentCopyService.findOne(+id);
  }

  @Get('/draft-legislation/:draftLegisaltionId')
  findAllByDraftLegislation(
    @Param('draftLegisaltionId') draftLegisaltionId: string,
  ) {
    return this.documentCopyService.findAllByDraftLegislation(
      +draftLegisaltionId,
    );
  }
  @Get('/draft-delegated-legislation/:refId')
  findAllByDraftDelegatedLegislation(@Param('refId') refId: string) {
    return this.documentCopyService.findAllByDraftDelegatedLegislation(+refId);
  }

  @Get('/legislation/:refId')
  findAllByLegislation(@Param('refId') refId: string) {
    return this.documentCopyService.findAllByLegislation(+refId);
  }

  @Get('/delegated-legislation/:refId')
  findAllbyDelegatedLegislation(@Param('refId') refId: string) {
    return this.documentCopyService.findOne(+refId);
  }

  @Patch(':id')
  @UseInterceptors(DocumentCopyUploadInterceptor)
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDocumentCopyDto: UpdateDocumentCopyDto,
  ) {
    // console.log(
    //   'UPDATE AND UPLOAD REQUEST \n\n',
    //   updateDocumentCopyDto,
    //   '\n\n',
    // );
    // let data: UpdateDocumentCopyDto;
    // if (file && file.filename) {
    //   console.log('hello it exists', file);
    //   data = {
    //     fileUri: this.documentCopyFileLocation + file.filename,
    //     refId: updateDocumentCopyDto.refId,
    //     language: updateDocumentCopyDto.language,
    //     type: updateDocumentCopyDto.type,
    //     status: updateDocumentCopyDto.status,
    //   };
    // } else {
    //   data = {
    //     refId: updateDocumentCopyDto.refId,
    //     language: updateDocumentCopyDto.language,
    //     type: updateDocumentCopyDto.type,
    //     status: updateDocumentCopyDto.status,
    //   };
    // }
    // return this.documentCopyService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentCopyService.remove(+id);
  }
}
