import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LegislationService } from './legislation.service';
import { CreateLegislationDto } from './dto/create-legislation.dto';
import { UpdateLegislationDto } from './dto/update-legislation.dto';
import { SearchLegislationDto } from './dto/search-keywork.dto';

interface SearchByAlphabetDto {
  alphabet: string;
}
@Controller('legislation')
export class LegislationController {
  constructor(private readonly legislationService: LegislationService) {}

  @Post()
  create(@Body() createLegislationDto: CreateLegislationDto) {
    return this.legislationService.create(createLegislationDto);
  }
  @Post('/legislation-group')
  createInExistingGroup(@Body() createLegislationDto: CreateLegislationDto) {
    return this.legislationService.createLegislationInExsitingLegislationGroup(
      createLegislationDto,
    );
  }

  @Get('/all')
  async getAllLegislation() {
    return await this.legislationService.getAllLegislation();
  }

  @Post('/search')
  async searchKeyword(@Body() searchLegislationDto: SearchLegislationDto) {
    return await this.legislationService.searchLegislation(
      searchLegislationDto.keyword,
    );
  }
  @Post('/search-in-legislation')
  async searchKeyWordInSpecificLegislation(@Body() searchLegislationDto: any) {
    return await this.legislationService.searchLegislation(
      searchLegislationDto.keyword,
    );
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(['admin'])
  // @Get()
  // findAll() {
  //   return this.legislationService.findAll();
  // }

  @Get()
  async getLegislationPaginated(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.findAllPaginated(
      +page,
      +pageSize,
      startingCharacter,
      +effectiveYear,
    );
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legislationService.findOne(+id);
  }

  @Get('/p/current')
  findAllActsPaginated2(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    console.log('\n\n', page, limit, '\n');

    return this.legislationService.findCurrentLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }
  @Get('/p/repealed')
  findAllRepealedActsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    console.log('\n\n', page, limit, '\n');

    return this.legislationService.findRepealedLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }
  @Get('/p/bill')
  findAllBillsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.findBilledLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }

  @Get('/paginate/bills')
  findAllActievBills(@Query('page') pageno = 0) {
    return this.legislationService.findAllBillsPaginated(+pageno);
  }
  @Get('/draft/acts')
  findAllDraftActs() {
    return this.legislationService.findAllDraftActs();
  }

  @Get('/paginate/conventions')
  findAllConventionsPaginated(@Param('pageno') pageno: string) {
    return this.legislationService.findAllConventionsPaginated(+pageno);
  }
  @Get('/draft/type')
  findAllDraftConventions(@Query('type') type) {
    console.log('\n\nQruery parameter \n\n');
    console.log(type);
    return this.legislationService.findAllDraftByType(type);
  }

  @Get('/history/sort')
  findAllByGroupSortedByYear(@Query('groupId') groupId) {
    return this.legislationService.findAllByGroupSortedByYear(groupId);
  }
  @Get('/legislative-history/:legislationId')
  findLegislativeHistory(@Param('legislationId') legislationId) {
    return this.legislationService.findLegislativeHistoryByLegislation(
      legislationId,
    );
  }

  @Post('/starting-with')
  findLatestNine(@Body() createLegislationDto: SearchByAlphabetDto) {
    return this.legislationService.searchByAlphabet(
      createLegislationDto.alphabet,
    );
  }

  @Get('/latest/legislation')
  getLatestLegislations(@Query('number') number: string) {
    return this.legislationService.findEnactedLegislatoin(+number);
  }

  @Get('/latest/bill')
  findBills() {
    return this.legislationService.findBills();
  }

  @Get('/latest/conventions')
  findConventions() {
    return this.legislationService.findConventions();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLegislationDto: UpdateLegislationDto,
  ) {
    return this.legislationService.update(+id, updateLegislationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legislationService.remove(+id);
  }
}
