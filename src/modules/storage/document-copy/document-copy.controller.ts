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
  UseGuards,
} from '@nestjs/common';
import { DocumentCopyService } from './document-copy.service';
import { CreateDocumentCopyDto } from './dto/create-document-copy.dto';
import { UpdateDocumentCopyDto } from './dto/update-document-copy.dto';
import { DocumentCopyUploadInterceptor } from 'src/interceptors/document.copy.interceptor.interceptor';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';

@Controller('document-copy')
export class DocumentCopyController {
  documentCopyFileLocation = '/storage/documentcopies/';
  constructor(private readonly documentCopyService: DocumentCopyService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post()
  @UseInterceptors(DocumentCopyUploadInterceptor)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentCopyDto: CreateDocumentCopyDto,
  ) {
    console.log(file);
    const data: CreateDocumentCopyDto = {
      fileUri: this.documentCopyFileLocation + file.filename,
      legislationId: createDocumentCopyDto.legislationId,
      delegatedLegislationId: createDocumentCopyDto.delegatedLegislationId,
      amendmentId: createDocumentCopyDto.amendmentId,
      language: createDocumentCopyDto.language,
    };
    console.log('file upload data \n\n\n', data, '\n\n');
    return this.documentCopyService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get()
  findAll() {
    return this.documentCopyService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentCopyService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/draft-legislation/:draftLegisaltionId')
  findAllByDraftLegislation(
    @Param('draftLegisaltionId') draftLegisaltionId: string,
  ) {
    return this.documentCopyService.findAllByDraftLegislation(
      +draftLegisaltionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
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
    return this.documentCopyService.findAllByDelegatedLegislation(+refId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
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

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentCopyService.remove(+id);
  }
}
