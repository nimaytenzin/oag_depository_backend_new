import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AmendmentService } from './amendment.service';
import { CreateAmendmentDto } from './dto/create-amendment.dto';
import { UpdateAmendmentDto } from './dto/update-amendment.dto';
import { CreateAmendmentSectionDto } from '../stash-section/dto/create-stash-section.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('amendment')
export class AmendmentController {
  constructor(private readonly amendmentService: AmendmentService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post()
  create(@Body() createAmendmentDto: CreateAmendmentDto) {
    return this.amendmentService.create(createAmendmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post('/section')
  createAmendmentSection(
    @Body() createAmendmentDto: CreateAmendmentSectionDto,
  ) {
    console.log('\n\n', createAmendmentDto, '\n\n');
    return this.amendmentService.createChangeSection(createAmendmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amendmentService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/legislation/:legislationId')
  findAllByLegislation(@Param('legislationId') legislationId: string) {
    return this.amendmentService.findAllByLegislation(+legislationId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/delegated-legislation/:dLegislationId')
  findAllByDLegislation(@Param('dLegislationId') dLegislationId: string) {
    return this.amendmentService.findAllByDelegatedLegislation(+dLegislationId);
  }
}
