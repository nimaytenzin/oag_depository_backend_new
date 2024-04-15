import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StashLegislationService } from './stash-legislation.service';
import { CreateStashLegislationDto } from './dto/create-stash-legislation.dto';
import { UpdateStashLegislationDto } from './dto/update-stash-legislation.dto';

@Controller('stash-legislation')
export class StashLegislationController {
  constructor(private readonly stashLegislationService: StashLegislationService) {}

  @Post('/upsert')
  create(@Body() createStashLegislationDto: CreateStashLegislationDto) {
    return this.stashLegislationService.upsert(createStashLegislationDto);
  }

  @Get('/get-all/:id')
  findOne(@Param('id') id: string) {
    return this.stashLegislationService.findOneByLegislationId(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stashLegislationService.remove(+id);
  }
}
