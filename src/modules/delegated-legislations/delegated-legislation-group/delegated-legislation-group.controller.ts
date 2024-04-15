import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DelegatedLegislationGroupService } from './delegated-legislation-group.service';
import { CreateDelegatedLegislationGroupDto } from './dto/create-delegated-legislation-group.dto';
import { UpdateDelegatedLegislationGroupDto } from './dto/update-delegated-legislation-group.dto';

@Controller('delegated-legislation-group')
export class DelegatedLegislationGroupController {
  constructor(
    private readonly delegatedLegislationGroupService: DelegatedLegislationGroupService,
  ) {}

  @Post()
  create(
    @Body()
    createDelegatedLegislationGroupDto: CreateDelegatedLegislationGroupDto,
  ) {
    return this.delegatedLegislationGroupService.create(
      createDelegatedLegislationGroupDto,
    );
  }

  @Get()
  findAll() {
    return this.delegatedLegislationGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegatedLegislationGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateDelegatedLegislationGroupDto: UpdateDelegatedLegislationGroupDto,
  ) {
    return this.delegatedLegislationGroupService.update(
      +id,
      updateDelegatedLegislationGroupDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegatedLegislationGroupService.remove(+id);
  }
}
