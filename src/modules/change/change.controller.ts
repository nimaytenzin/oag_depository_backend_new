import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChangeService } from './change.service';
import { CreateChangeDto } from './dto/create-change.dto';
import { UpdateChangeDto } from './dto/update-change.dto';

@Controller('change')
export class ChangeController {
  constructor(private readonly changeService: ChangeService) {}

  @Post()
  create(@Body() createChangeDto: CreateChangeDto) {
    return this.changeService.create(createChangeDto);
  }
  @Get('/section/all/:id')
  findOne(@Param('id') id: string) {
    return this.changeService.findAllBySection(+id);
  }
}
