import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LegislationRelationshipService } from './legislation-relationship.service';
import { CreateLegislationRelationshipDto } from './dto/create-legislation-relationship.dto';
import { UpdateLegislationRelationshipDto } from './dto/update-legislation-relationship.dto';

@Controller('legislation-relationship')
export class LegislationRelationshipController {
  constructor(private readonly legislationRelationshipService: LegislationRelationshipService) {}

  @Post()
  create(@Body() createLegislationRelationshipDto: CreateLegislationRelationshipDto) {
    return this.legislationRelationshipService.create(createLegislationRelationshipDto);
  }

  @Get()
  findAll() {
    return this.legislationRelationshipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legislationRelationshipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLegislationRelationshipDto: UpdateLegislationRelationshipDto) {
    return this.legislationRelationshipService.update(+id, updateLegislationRelationshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legislationRelationshipService.remove(+id);
  }
}
