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
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';

interface SearchByAlphabetDto {
  alphabet: string;
}

@Controller('legislation')
export class LegislationController {
  constructor(private readonly legislationService: LegislationService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post()
  create(@Body() createLegislationDto: CreateLegislationDto) {
    return this.legislationService.create(createLegislationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post('/legislation-group')
  createInExistingGroup(@Body() createLegislationDto: CreateLegislationDto) {
    return this.legislationService.createLegislationInExsitingLegislationGroup(
      createLegislationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post('/search')
  async searchKeyword(@Body() searchLegislationDto: SearchLegislationDto) {
    return await this.legislationService.searchLegislation(
      searchLegislationDto.keyword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post('/search-in-legislation')
  async searchKeyWordInSpecificLegislation(@Body() searchLegislationDto: any) {
    return await this.legislationService.searchLegislation(
      searchLegislationDto.keyword,
    );
  }

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

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legislationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('min/sm')
  getAllminified(@Param('id') id: string) {
    return this.legislationService.findAllMinified();
  }
  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/p/current')
  findAllActsPaginated2(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.findCurrentLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
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

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
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

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/paginate/bills')
  findAllActievBills(@Query('page') pageno = 0) {
    return this.legislationService.findAllBillsPaginated(+pageno);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/draft/acts')
  findAllDraftActs() {
    return this.legislationService.findAllDraftActs();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/paginate/conventions')
  findAllConventionsPaginated(@Param('pageno') pageno: string) {
    return this.legislationService.findAllConventionsPaginated(+pageno);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/draft/type')
  findAllDraftConventions(@Query('type') type) {
    console.log('\n\nQruery parameter \n\n');
    console.log(type);
    return this.legislationService.findAllDraftByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/history/sort')
  findAllByGroupSortedByYear(@Query('groupId') groupId) {
    return this.legislationService.findAllByGroupSortedByYear(groupId);
  }

  

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Post('/starting-with')
  findLatestNine(@Body() createLegislationDto: SearchByAlphabetDto) {
    return this.legislationService.searchByAlphabet(
      createLegislationDto.alphabet,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/latest/legislation')
  getLatestLegislations(@Query('number') number: string) {
    return this.legislationService.findEnactedLegislatoin(+number);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/latest/bill')
  findBills() {
    return this.legislationService.findBills();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/latest/conventions')
  findConventions() {
    return this.legislationService.findConventions();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLegislationDto: UpdateLegislationDto,
  ) {
    return this.legislationService.update(+id, updateLegislationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legislationService.remove(+id);
  }

  // DRAFTS - isDraft? TRUE //

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/p/draft/legislations')
  getAllDraftLegislationsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.findDraftLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }
}
