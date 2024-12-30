import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { SectionService } from './section.service';
import UpdateSectionDto from './dto/update-section.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { SearchLegislationDto } from '../legislations/legislation/dto/search-keywork.dto';
import { CreateSectionDto, InsertSectionDto } from './dto/create-section.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post('/insert')
  insert(@Body() data: InsertSectionDto) {
    return this.sectionService.insertInBetween(data);
  }

  @Post('/search')
  searchClause(@Body() searchDto: SearchLegislationDto) {
    return this.sectionService.searchClause(searchDto.keyword);
  }

  @Post('/search-in-legislation')
  searchClauseInLegislation(@Body() searchDto: any) {
    return this.sectionService.searchClauseInLegislation(
      searchDto.keyword,
      searchDto.legislationId,
    );
  }
  @Post('/search-in-delegated-legislation')
  searchClauseInDelegateLegislation(@Body() searchDto: any) {
    return this.sectionService.searchClauseInDelegatedLegislation(
      searchDto.keyword,
      searchDto.delegatedLegislationId,
    );
  }

  @Get('/build-index/:authKey')
  buildIndex(@Param('authKey') authKey: string) {
    console.log(authKey);
    if (authKey !== '1234') {
      throw new UnauthorizedException();
    }
    return this.sectionService.buildSearchIndex();
  }

  @Get('/fields')
  getFields() {
    return this.sectionService.fields();
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('legislation/:legislationId')
  findAllSectionsByLegislation(@Param('legislationId') legislationId: string) {
    return this.sectionService.findSectionsByLegislationId(+legislationId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('delegated-legislation/:delegatedLegislationId')
  findAllSectionsByDelegatedLegislation(
    @Param('delegatedLegislationId') delegatedLegislationId: string,
  ) {
    return this.sectionService.findSectionsByDelegatedLegislationId(
      +delegatedLegislationId,
    );
  }

  @Get('toc/by-legislation/:legislationId')
  findHeadingsByLegislation(@Param('legislationId') legislationId: string) {
    return this.sectionService.findHeadingsByLegislation(+legislationId);
  }
  @Get('toc/by-delegated-legislation/:delegatedLegislationId')
  findHeadingsByDelegatedLegislation(
    @Param('delegatedLegislationId') delegatedLegislationId: string,
  ) {
    return this.sectionService.findHeadingsByDelegatedLegislation(
      +delegatedLegislationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(+id, updateSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionService.remove(+id);
  }
}
