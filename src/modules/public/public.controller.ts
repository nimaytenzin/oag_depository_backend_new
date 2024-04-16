import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { LegislationService } from '../legislations/legislation/legislation.service';
import { DelegatedLegislationService } from '../delegated-legislations/delegated-legislation/delegated-legislation.service';
import { SectionService } from '../section/section.service';

@Controller('p')
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    private readonly legislationService: LegislationService,
    private readonly delegatedLegislationService: DelegatedLegislationService,
    private readonly sectionService: SectionService,
  ) {}

  @Post('/legislation/search')
  searchClauseInLegislation(@Body() searchDto: any) {
    return this.sectionService.searchClauseInLegislation(
      searchDto.keyword,
      searchDto.delegatedLegislationId,
    );
  }

  @Get('/legislations/current')
  findAllActsPaginated2(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.publicFindCurrentLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }
  @Get('/legislations/repealed')
  findAllRepealedActsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.publicFindRepealedLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }
  @Get('/legislations/bill')
  findAllBillsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.publicFindBilledLegislationsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }
  @Get('/conventions')
  findAllConventionsPaginated(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.legislationService.publicFindAllConventionsPaginated({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      startingCharacter: startingCharacter,
      effectiveYear: +effectiveYear,
    });
  }

  //****************** */ PUBLIC ROUTES FOR DELEGATED LEGISLAIONTS **************//

  @Get('/delegated-legislation/:delegatedLegislationId')
  findDelegatedLegislationDetails(@Param('delegatedLegislationId') id: string) {
    return this.delegatedLegislationService.publicFindOne(+id);
  }

  @Get('/delegated-legislation/sections/:delegatedLegislationId')
  findAllSectionsByDelegatedLegislation(
    @Param('delegatedLegislationId') id: string,
  ) {
    return this.sectionService.publicfindSectionsByDelegatedLegislationId(+id);
  }
  // @Get('/delegated-legislation/search/:delegatedLegislationId')
  // SearchInDelegatedLegislation(@Param('delegatedLegislationId') id: string) {
  //   return this.sectionService.SearhIn(+id);
  // }

  @Post('/delegated-legislation/search')
  searchClauseInDelegatedLegislation(@Body() searchDto: any) {
    return this.sectionService.searchClauseInLegislation(
      searchDto.keyword,
      searchDto.delegatedLegislationId,
    );
  }

  @Get('/delegated-legislation/toc/:delegatedLegislationId')
  findTableContentByDelegatedLegislation(
    @Param('delegatedLegislationId') id: string,
  ) {
    return this.sectionService.publicFindHeadingsByDelegatedLegislation(+id);
  }

  @Get('/delegated-legislations/current')
  findCurrentDelegatedLegislations(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.delegatedLegislationService.publicFindCurrentDelegatedLegislationsPaginated(
      {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        startingCharacter: startingCharacter,
        effectiveYear: +effectiveYear,
      },
    );
  }

  @Get('/delegated-legislations/modified')
  findModifiedDelegatedLegislations(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.delegatedLegislationService.publicFindModifiedDelegatedLegislationsPaginated(
      {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        startingCharacter: startingCharacter,
        effectiveYear: +effectiveYear,
      },
    );
  }

  @Get('/delegated-legislations/revoked')
  findRevokedDelegatedLegislations(
    @Query('page') page,
    @Query('limit') limit,
    @Query('startsWith') startingCharacter?: string,
    @Query('publishedIn') effectiveYear?: number,
  ) {
    return this.delegatedLegislationService.publicFindRevokedDelegatedLegislationsPaginated(
      {
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
        startingCharacter: startingCharacter,
        effectiveYear: +effectiveYear,
      },
    );
  }

  //HOME SEARCH
  // 1. Search keywords comma seperated in sections of legislation
  @Get('/legislations/adv/search-content')
  searchForKeywordInLegislationWithinContent(
    @Query('Keywords') keywords: string,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    return this.sectionService.PublicsearchForKeywordInLegislationWithinContent(
      {
        keywords: keywords,
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
      },
    );
  }
  @Get('/legislations/adv/search-title')
  searchForKeywordInLegislationWithinTitle(
    @Query('Keywords') keywords: string,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    return this.legislationService.PublicsearchForKeywordInLegislationWithinTitle(
      keywords,
    );
  }

  //search within delegated legislations
  @Get('/delegated-legislations/adv/search-title')
  searchForKeywordInDelegatedLegislationWithinTitle(
    @Query('Keywords') keywords: string,
  ) {
    return this.delegatedLegislationService.PublicsearchForKeywordInDelegatedLegislationWithinTitle(
      keywords,
    );
  }

  @Get('/delegated-legislations/adv/search-content')
  searchForKeywordInDelegatedLegislationWithinContent(
    @Query('Keywords') keywords: string,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    return this.sectionService.PublicsearchForKeywordInDelegatedLegislationWithinContent(
      {
        keywords: keywords,
        page: page ? +page : 1,
        limit: limit ? +limit : 10,
      },
    );
  }
  // 2. Search keyword comma seperated in sections of DL
  // 3. Search keywords comma seperated in title of legislation
  // 4. search keywords comma seperated in title of delegated legisaltions
}
