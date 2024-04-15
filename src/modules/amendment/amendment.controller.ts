import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AmendmentService } from './amendment.service';
import { CreateAmendmentDto } from './dto/create-amendment.dto';
import { UpdateAmendmentDto } from './dto/update-amendment.dto';
import { CreateAmendmentSectionDto } from '../stash-section/dto/create-stash-section.dto';

@Controller('amendment')
export class AmendmentController {
  constructor(private readonly amendmentService: AmendmentService) {}

  @Post()
  create(@Body() createAmendmentDto: CreateAmendmentDto) {
    return this.amendmentService.create(createAmendmentDto);
  }

  @Post('/section')
  createAmendmentSection(
    @Body() createAmendmentDto: CreateAmendmentSectionDto,
  ) {
    return this.amendmentService.createChangeSection(createAmendmentDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amendmentService.findOne(+id);
  }

  @Get('/legislation/:legislationId')
  findAllByLegislation(@Param('legislationId') legislationId: string) {
    return this.amendmentService.findAllByLegislation(+legislationId);
  }

  @Get('/delegated-legislation/:dLegislationId')
  findAllByDLegislation(@Param('dLegislationId') dLegislationId: string) {
    return this.amendmentService.findAllByDelegatedLegislation(+dLegislationId);
  }
}
