import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DelegatedLegislationRelationshipService } from './delegated-legislation-relationship.service';
import { CreateDelegatedLegislationRelationshipDto } from './dto/create-delegated-legislation-relationship.dto';
import { UpdateDelegatedLegislationRelationshipDto } from './dto/update-delegated-legislation-relationship.dto';

@Controller('delegated-legislation-relationship')
export class DelegatedLegislationRelationshipController {
  constructor(private readonly delegatedLegislationRelationshipService: DelegatedLegislationRelationshipService) {}

  @Post()
  create(@Body() createDelegatedLegislationRelationshipDto: CreateDelegatedLegislationRelationshipDto) {
    return this.delegatedLegislationRelationshipService.create(createDelegatedLegislationRelationshipDto);
  }

  @Get()
  findAll() {
    return this.delegatedLegislationRelationshipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegatedLegislationRelationshipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDelegatedLegislationRelationshipDto: UpdateDelegatedLegislationRelationshipDto) {
    return this.delegatedLegislationRelationshipService.update(+id, updateDelegatedLegislationRelationshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegatedLegislationRelationshipService.remove(+id);
  }
}
