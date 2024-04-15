import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LegislationGroupService } from './legislation-group.service';
import { CreateLegislationGroupDto } from './dto/create-legislation-group.dto';
import { UpdateLegislationGroupDto } from './dto/update-legislation-group.dto';

@Controller('legislation-group')
export class LegislationGroupController {
  constructor(
    private readonly legislationGroupService: LegislationGroupService,
  ) {}

  @Post()
  create(@Body() createLegislationGroupDto: CreateLegislationGroupDto) {
    return this.legislationGroupService.create(createLegislationGroupDto);
  }

  @Get()
  findAll() {
    return this.legislationGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legislationGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLegislationGroupDto: UpdateLegislationGroupDto,
  ) {
    return this.legislationGroupService.update(+id, updateLegislationGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legislationGroupService.remove(+id);
  }
}
