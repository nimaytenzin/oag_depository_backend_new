import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnnexureService } from './annexure.service';
import { CreateAnnexureDto } from './dto/create-annexure.dto';
import { UpdateAnnexureDto } from './dto/update-annexure.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { AnnexureUploadInterceptor } from 'src/interceptors/annexure.interceptor.interceptor';

@Controller('annexure')
export class AnnexureController {
  constructor(private readonly annexureService: AnnexureService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @Roles(['admin', 'superadmin'])
  @UseInterceptors(AnnexureUploadInterceptor)
  create(
    @Body() createAnnexureDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const destination = '/storage/annexures/';
    const data: CreateAnnexureDto = {
      title_eng: createAnnexureDto.title_eng,
      title_dzo: createAnnexureDto.title_dzo,
      fileUri_eng: null,
      fileUri_dzo: null,
      legislationType: createAnnexureDto.legislationType,
      annexureType: createAnnexureDto.annexureType,
      refId: createAnnexureDto.refId,
    };
    for (const fieldName in files) {
      console.log(files[fieldName][0]);
      if (files[fieldName][0].fieldname === 'file_eng') {
        data.fileUri_eng = destination + files[fieldName][0].filename;
      }
      if (files[fieldName][0].fieldname === 'file_dzo') {
        data.fileUri_dzo = destination + files[fieldName][0].filename;
      }
    }
    return this.annexureService.create(data);
  }

  @Get()
  findAll() {
    return this.annexureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annexureService.findOne(+id);
  }

  @Get('/legislation/:refId/:type')
  findDraftsByLegislation(
    @Param('refId') refId: string,
    @Param('type') type: string,
  ) {
    return this.annexureService.findByLegislation(+refId, type);
  }
  @Get('/delegated-legislation/:refId/:type')
  findDraftsByDelegatedLegislation(
    @Param('refId') refId: string,
    @Param('type') type: string,
  ) {
    return this.annexureService.findByDelegatedLegislation(+refId, type);
  }
  @Get('/delegated-legislation/:refId')
  findAllbyDelegatedLegislation(@Param('refId') refId: string) {
    return this.annexureService.findOne(+refId);
  }

  @Patch(':id')
  @UseInterceptors(AnnexureUploadInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateAnnexureDto: UpdateAnnexureDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const destination = '/storage/annexures/';
    const data: CreateAnnexureDto = {
      title_eng: updateAnnexureDto.title_eng,
      title_dzo: updateAnnexureDto.title_dzo,
      fileUri_eng: updateAnnexureDto.fileUri_eng,
      fileUri_dzo: updateAnnexureDto.fileUri_dzo,
      legislationType: updateAnnexureDto.legislationType,
      annexureType: updateAnnexureDto.annexureType,
      refId: updateAnnexureDto.refId,
    };
    for (const fieldName in files) {
      if (files[fieldName][0].fieldname === 'file_eng') {
        data.fileUri_eng = destination + files[fieldName][0].filename;
      }
      if (files[fieldName][0].fieldname === 'file_dzo') {
        data.fileUri_dzo = destination + files[fieldName][0].filename;
      }
    }
    console.log('UPDAING ANNEXURES', data);
    return this.annexureService.update(+id, updateAnnexureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annexureService.remove(+id);
  }
}
