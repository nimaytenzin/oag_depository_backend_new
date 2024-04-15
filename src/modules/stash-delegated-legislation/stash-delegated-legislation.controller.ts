import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StashDelegatedLegislationService } from './stash-delegated-legislation.service';
import { CreateStashDelegatedLegislationDto } from './dto/create-stash-delegated-legislation.dto';

@Controller('stash-delegated-legislation')
export class StashDelegatedLegislationController {
  constructor(private readonly stashDelegatedLegislationService: StashDelegatedLegislationService) {}

  @Post('/upsert')
  create(@Body() createStashLegislationDto: CreateStashDelegatedLegislationDto) {
    return this.stashDelegatedLegislationService.upsert(createStashLegislationDto);
  }


  @Get('/get-all/:id')
  findOne(@Param('id') id: string) {
    return this.stashDelegatedLegislationService.findOneByDelegatedLegislationId(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stashDelegatedLegislationService.remove(+id);
  }
}
