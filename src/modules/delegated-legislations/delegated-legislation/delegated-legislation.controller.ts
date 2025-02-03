import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DelegatedLegislationService } from './delegated-legislation.service';
import { CreateDelegatedLegislationDto } from './dto/create-delegated-legislation.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { DelegatedLegislationStatus } from 'src/constants/enums';

@Controller('delegated-legislation')
export class DelegatedLegislationController {
  constructor(
    private readonly delegatedLegislationService: DelegatedLegislationService,
  ) {}

  @Post()
  create(@Body() createLegislationDto: CreateDelegatedLegislationDto) {
    return this.delegatedLegislationService.create(createLegislationDto);
  }

  @Post('/legislation-group')
  createInExistingGroup(
    @Body() createLegislationDto: CreateDelegatedLegislationDto,
  ) {
    return this.delegatedLegislationService.createLegislationInExsitingLegislationGroup(
      createLegislationDto,
    );
  }

  @Get()
  findAll() {
    return this.delegatedLegislationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegatedLegislationService.findOne(+id);
  }

  @Get('/history/sort')
  findAllByGroupSortedByYear(@Query('delegatedLegislationId') groupId) {
    return this.delegatedLegislationService.findAllByGroupSortedByYear(groupId);
  }

  @Get('/draft/type')
  findAllDraftConventions(@Query('type') type) {
    console.log('\n\nQruery parameter \n\n');
    console.log(type);
    return this.delegatedLegislationService.findAllDraftByType(type);
  }

  @Get('/latest/delegated-legislations')
  getLatestDelegatedLegislations(@Query('number') number: string) {
    return this.delegatedLegislationService.findEnactedDelegatedLegislatoin(
      +number,
    );
  }

  @Get('/paginate/rules')
  findRepealedActsPaginated(@Query('page') pageno = 0) {
    return this.delegatedLegislationService.findRulesPaginated(+pageno);
  }

  @Get('/paginate/repealed')
  findRepealedDLPaginated(@Query('page') pageno = 0) {
    return this.delegatedLegislationService.findRepealedDlPaginated(+pageno);
  }

  @Get('/rules/paginated/:pageno')
  findRulesPaginated(@Param('pageno') pageno: string) {
    return this.delegatedLegislationService.findRulesPaginated(+pageno);
  }

  @Get('/guidelines/paginated/:pageno')
  findGuidelinesPaginated(@Param('pageno') pageno: string) {
    return this.delegatedLegislationService.findGuidelinesPaginated(+pageno);
  }

  @Get('/parentLegislation/:parentLegislationId')
  findAllbyParent(@Param('parentLegislationId') parentLegislationId: string) {
    return this.delegatedLegislationService.findAllByParentLegislation(
      +parentLegislationId,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.delegatedLegislationService.update(+id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegatedLegislationService.remove(+id);
  }

  @Get('/published/revoked/p')
  getAllRevokedDl(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.delegatedLegislationService.findAllRevokedPublishedDL(
      {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        startingCharacter: startingCharacter,
        effectiveYear: +effectiveYear,
      },
    );
  }

  @Get('/published/current/p')
  getAllCurrentDL(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.delegatedLegislationService.findAllCurrentPublishedDL(
      {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        startingCharacter: startingCharacter,
        effectiveYear: +effectiveYear,
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(['admin'])
  @Get('/p/draft')
  getAllDrafDelegatedtLegislationsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.delegatedLegislationService.findDraftDelegatedLegislationsPaginated(
      {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        startingCharacter: startingCharacter,
        effectiveYear: +effectiveYear,
      },
    );
  }
}
