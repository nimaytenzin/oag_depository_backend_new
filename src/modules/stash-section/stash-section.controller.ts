import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StashSectionService } from './stash-section.service';
import { CreateStashSectionDto } from './dto/create-stash-section.dto';
import { UpdateStashSectionDto } from './dto/update-stash-section.dto';

@Controller('stash-section')
export class StashSectionController {
  constructor(private readonly stashSectionService: StashSectionService) {}

  @Post('/upsert')
  upsert(@Body() createStashSectionDto: CreateStashSectionDto) {
    return this.stashSectionService.upsert(createStashSectionDto);
  }

  @Get('/stash/get-all/:id')
  findOne(@Param('id') id: string) {
    return this.stashSectionService.findAllByLegislationId(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stashSectionService.remove(+id);
  }
}
